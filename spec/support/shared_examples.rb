require 'spec_helper'

def fill_in_ace_query_body(text)
  text_with_newlines = text.gsub("\n", "\\n")
  page.execute_script("$('[ng-view]').scope().editor.setValue('#{text_with_newlines}');")
end

def create_new_query(query_factories)
  query_factories.each do |query_factory|
    create(query_factory)
  end
end

def stub_github_calls
  allow(Github::Blob).to receive(:create) { '123456789abcdef123456789abcdef123456789a' }
  allow(Github::Blob).to receive(:get) { { 'content' => 'SELECT 1' } }
  allow_any_instance_of(QueryVersion).to receive(:github_save)
end

shared_context 'oauth hash' do
  let(:oauth_hash) do
    {
      provider: 'google_oauth2',
      uid: '111111111111111111111',
      info: {
        name: 'test',
        email: 'test@ll.com'
      },
      credentials: {
        token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        expires_at: (Time.now + 1.hour).to_i
      },
      extra: {
        raw_info: {
          email_verified: 'true'
        }
      }
    }
  end
end

shared_context 'resque module' do
  module Resque
    def pending_jobs
      @pending_jobs ||= []
    end

    def last_exception
      @last_exception
    end

    def last_exception=(e)
      @last_exception = e
    end

    def run_last_job
      arr = pending_jobs.pop
      klass = arr.shift
      begin
        klass.perform(*arr)
      rescue Exception => e
        self.last_exception = e
      end
    end

    def run_all_jobs
      run_last_job until pending_jobs.empty?
    end

    alias_method :real_enqueue, :enqueue

    def enqueue(*args)
      pending_jobs.push(args)
    rescue Exception => e
      # ignore
    end
  end
end

shared_context 'query bodies' do
  let (:query_body) { attributes_for(:query)[:latest_body] }
  let (:multi_line_query_body) { attributes_for(:multi_line_query)[:latest_body] }
  let (:syntax_error_query_body) { attributes_for(:syntax_error_query)[:latest_body] }
  let (:undefined_table_query_body) { attributes_for(:undefined_table_query)[:latest_body] }
  let (:query_returning_many_rows_body) { attributes_for(:query_returning_many_rows)[:latest_body] }
end
