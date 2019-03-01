# Operational Notes

## Hanging queries issues

We noticed that queries would hang and go zombie once in a while.

The TL;DR is that the MTU should be 1500 (ie, no jumbo frames) and the keepalive settings should be configured correctly.

The host machines just need to be set up with the proper MTU.

### MTU

- lookup MTU on host: `ip link show eth0`
- set MTU on host: `sudo ip link set dev eth0 mtu 1500`

Note: needs to be set on host, not just the container.

### TCP keepalive

```
cat /proc/sys/net/ipv4/tcp_keepalive_time
cat /proc/sys/net/ipv4/tcp_keepalive_intvl
cat /proc/sys/net/ipv4/tcp_keepalive_probes
```

#### More reading:

http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-firewall-guidance.html
http://docs.aws.amazon.com/redshift/latest/mgmt/connecting-drop-issues.html
http://docs.aws.amazon.com/redshift/latest/dg/queries-troubleshooting.html
https://stackoverflow.com/questions/21457282/long-query-in-amazon-redshift-never-return
