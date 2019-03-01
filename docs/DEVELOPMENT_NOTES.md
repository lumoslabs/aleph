# Development Notes

Unfortunately, development on any RoR/Angular app such as Aleph requires some amount of yak shaving to set up a proper environment. Here are some pointers and gotchas.

# Relevant Versions

This set of versions should work

* Ruby: 2.2.4
* Bundler: 1.11.2
* Node: 0.12.18
* Npm: 2.10.1

I have found `rbenv` and `nvm` to be reasonable ways to manage these versions on a project by project basis

# Mac OS Specific Notes

Here are some complexities I have encountered while developing on High Sierra.

Bundler: `ARCHFLAGS="-arch x86_64" bundle install` needed for certain gems
Puma: `sudo gem install puma -v '2.11.3' -- --with-opt-include=/usr/local/opt/openssl/include`
libv8: `gem install libv8 -v '3.16.14.13' -- --with-system-v8`
therubyracer: `gem install therubyracer -- --with-v8-dir=/usr/local/opt/v8@3.15`
