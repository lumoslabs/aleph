Retriable.configure do |c|
  c.contexts[:schema_refresh] = {
    base_interval: 3,
    tries: 15,
  }

  c.contexts[:s3] = {
    base_interval: 30,
    multiplier: 1,
    tries: 10
  }
end
