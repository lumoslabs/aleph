require 'clockwork'
require './config/boot'
require './config/environment'

module Clockwork
  every(1.day, 'AlertJob', at: '06:00', tz: 'Pacific Time (US & Canada)') { Alert.run_all }
end
