#!/usr/bin/env ruby
require 'highline/import'
DEFAULT_CONFIGURATION_PATH = '/tmp/configuration'

say "Hi! Welcome to Aleph, let's get started shall we?"


# * configuration path *
# ======================
configuration_path = ask("Please specify a configuration path (default is #{DEFAULT_CONFIGURATION_PATH})") do |ac|
  ac.default = DEFAULT_CONFIGURATION_PATH
end

# * redshift connection *
# =======================
redshift_choice = agree("Do you currently have a Redshift connection you would like to configure?")

if redshift_choice
  #TODO: ask about redshift properties here and write config file
else
  redshift_seed = agree("Would you like us to seed a sample Redshift connection?")
  if redshift_seed
    seed_redshift()
  else
    say [
      'Ok, currently you do not have a Redshift connection configured -- no problem,',
      "you can do that later by editing #{configuration_path}/redshift.yml"
      ].join("\n")
  end
end

# * s3 *
# ======
say [
 'If you have an Aws s3 bucket set up, we can store your query results there (recommended for production).',
 "No problem if you don't, we can just store your results on the local server"
 ].join("\n")

s3_choice = agree('Use s3?')

if s3_choice
  s3_bucket = ask('What is your s3 bucket?')
else
  say "Cool, we'll store the data locally. You can change this later by editing #{configuration_path}/config.yml"
end

# * github *
# ==========
say 'Aleph can store query versions in github so you can view diffs and history'

github_choice = agree('Do you have a github repo Aleph can use?')

if github_choice
  # ask about github shit
else
  say 'No problem, your query versions are still stored in the db'
end



# * resque pool *
# ================
say 'Aleph has two worker queues, one for queries and another for alerts.'
say 'Typically in a production setting we recommend more workers for queries than alerts'

query_exec = ask('How many workers do you want for queries?') { |qe| qe.default = '1' }
alert_exec = ask('How many workers do you want for alerts?') { |ae| ae.default = '1' }




