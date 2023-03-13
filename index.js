import http2 from 'node:http2'
import { Route53Client,
          ListResourceRecordSetsCommand, 
          ChangeResourceRecordSetsCommand,
          ChangeAction } from '@aws-sdk/client-route-53'

const R53_ZONE = process.env.ZONE_ID
const RECORD_NAME = process.env.HOST_NAME

const clientSession = http2.connect('https://ipinfo.io');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  let d = ''
  req.on('data', (chunk) => { d += chunk });
  req.on('end', () => { 
    clientSession.close()
    try {
      let info = JSON.parse(d)
      if (info.ip) {
        console.info(`Found current IP address of ${info.ip}`)
        upsert_dns(info.ip)
      } else {
        console.error('IP not found in payload')
      }
    }
    catch {
      console.error('Unable do decode response as JSON')
    }
  });
});

const upsert_dns = (ip) => {
  const client = new Route53Client()
  const list_cmd = new ListResourceRecordSetsCommand({
    HostedZoneId: R53_ZONE,
    MaxItems: 1,
    StartRecordName: RECORD_NAME
  })
  client.send(list_cmd).then(lresp => {
    let resolved_ip = lresp.ResourceRecordSets[0].ResourceRecords[0].Value
    if (ip == resolved_ip) {
      console.info('Current IP already set in Route53.  No update required.')
    } else {
      console.info(`IP mismatch found.  Curernt: ${ip} Route53: ${resolved_ip}.  Attempting to update:`)
      lresp.ResourceRecordSets[0].ResourceRecords[0].Value = ip
      let upsert_cmd = new ChangeResourceRecordSetsCommand({
        HostedZoneId: R53_ZONE,
        ChangeBatch: {
          Changes: [{
            Action: ChangeAction.UPSERT,
            ResourceRecordSet: lresp.ResourceRecordSets[0]
          }]
        }
      })
      client.send(upsert_cmd).then(r => {
        console.info('Update was successful')
      }).catch(e => {
        console.error('An error occurred while updating Route53',e)
      })
    }
  }).catch(e => {
    console.error('Error querying Route53 zone',e)
  })
}