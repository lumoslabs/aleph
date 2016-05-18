require 'spec_helper'

describe Role do
  let(:name) { 'admin' }
  let(:password_key) { 'ADMIN_REDSHIFT_PASSWORD' }
  let(:username_key) { 'ADMIN_REDSHIFT_USERNAME' }

  describe '#name_to_username_key' do
    subject { Role.name_to_username_key(name) }

    it 'gives the key for the ENV variable containing the role database username' do
      expect(subject).to eq(username_key)
    end
  end

  describe '#name_to_password_key' do
    subject { Role.name_to_password_key(name) }

    it 'gives the key for the ENV variable containing the role database password' do
      expect(subject).to eq(password_key)
    end
  end

  describe '#password_key_to_name' do
    subject { Role.password_key_to_name(password_key) }

    it 'gives the key for the ENV variable containing the role database password' do
      expect(subject).to eq(name)
    end
  end

  describe '#password_key_to_name' do
    subject { Role.username_key_to_name(username_key) }

    it 'gives the key for the ENV variable containing the role database password' do
      expect(subject).to eq(name)
    end
  end

  context 'with username and password ENV keys set' do
    before do
      ENV[password_key] = 'password'
      ENV[username_key] = 'username'
    end

    describe '#configured_connections' do
      subject { Role.configured_connections }

      it 'gives the connections that have username and password keys' do
        expect(subject).to eq([name])
      end
    end
  end
end
