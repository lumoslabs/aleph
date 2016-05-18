require 'spec_helper'

def stub_connection
  allow(ActiveRecord::Base).to receive(:connection) { active_record_connection }
  allow(active_record_connection).to receive(:disable_referential_integrity) # database_cleaner is sending this
end

describe Github::Pusher do
  let(:valid_sha) { '123456789abcdef123456789abcdef123456789a' }
  let(:valid_sha_x) { '123456789abcdef123456789abcdef123456789b' }
  let(:valid_sha_y) { '123456789abcdef123456789abcdef123456789c' }
  let(:valid_sha_z) { '123456789abcdef123456789abcdef123456789d' }

  let(:invalid_hex_sha) { '987654321qwerty987654321qwerty987654321a' }
  let(:invalid_short_sha) { '123456789abcdef123456789abcdef123456789' }

  let(:active_record_connection) { instance_double('Connection') }
  subject { Github::Pusher.new }

  describe '#create_blob' do
    context 'when sha returned by git is valid' do
      before do
        allow(Github::Blob).to receive(:create) { valid_sha }
        subject.create_blob('some_body')
      end

      it 'fetches a blob_sha given the body' do
        expect(Github::Blob).to have_received(:create).with('some_body')
      end

      it 'returns the blob_sha' do
        expect(subject.create_blob('some_body')).to equal(valid_sha)
      end
    end

    context 'when sha returned by git is not a hex' do
      before do
        allow(Github::Blob).to receive(:create) { invalid_hex_sha }
      end

      it 'raises when the returned sha is not a hex' do
        expect { subject.create_blob('some_body') }.to raise_error(RuntimeError)
      end
    end

    context 'when sha returned by git is short' do
      before do
        allow(Github::Blob).to receive(:create) { invalid_short_sha }
      end

      it 'raises when the returned sha is not a hex' do
        expect { subject.create_blob('some_body') }.to raise_error(RuntimeError)
      end
    end
  end

  describe '#create_tree' do
    let(:tree_info_from_db) do
      [
        { 'query_id' => '1', 'blob_sha' => valid_sha_x },
        { 'query_id' => '2', 'blob_sha' => valid_sha_y },
      ]
    end

    before do
      stub_connection
      allow(active_record_connection).to receive(:execute) { tree_info_from_db }
    end

    context 'when sha returned by git is valid' do
      before do
        allow(Github::Tree).to receive(:create) { valid_sha_z }
        subject.create_tree(2, valid_sha, 'base_tree')
      end

      it 'fetches a tree_sha passing the correct arguments' do
        tree = [
          {
            'path' => 'query_1',
            'mode' => '100644',
            'type' => 'blob',
            'sha' => valid_sha_x
          },
          {
            'path' => 'query_2',
            'mode' => '100644',
            'type' => 'blob',
            'sha' => valid_sha
          }
        ]
        expect(Github::Tree).to have_received(:create).with(tree, 'base_tree')
      end

      it 'returns the correct tree_sha' do
        expect(subject.create_tree(2, valid_sha, 'base_tree')).to equal(valid_sha_z)
      end
    end
  end

  describe '#create_commit' do
    context 'when sha returned by git is valid' do
      before do
        allow(DateTime).to receive_message_chain(:now, :utc, :strftime) { 'now!' }
        allow(Github::Commit).to receive(:create) { valid_sha }
        subject.create_commit(2, 'tree_sha', 'parent_commit_sha', 111, 'Rudolf Steiner', 'rstein@geist.y')
      end

      it 'fetches a commit_sha passing the correct arguments' do
        expect(Github::Commit).to have_received(:create).with('Version 111 for query 2', 'tree_sha',
        ['parent_commit_sha'],
        {
          'name' => 'Rudolf Steiner',
          'email' => 'rstein@geist.y',
          'date' => 'now!'
        })
      end

      it 'returns the correct commit_sha' do
        expect(subject.create_commit(2, 'tree_sha', 'parent_commit_sha', 111, 'Rudolf Steiner', 'rstein@geist.y')).to equal(valid_sha)
      end
    end
  end

  describe '#git_push' do
    before do
      stub_connection
      allow(active_record_connection).to receive(:execute) { [{ 'tree_sha' => 'latest_tree_sha', 'commit_sha' => 'latest_commit_sha' }] }
      allow(subject).to receive(:create_blob) { valid_sha_x }
      allow(subject).to receive(:create_tree) { valid_sha_y }
      allow(subject).to receive(:create_commit) { valid_sha_z }
      allow(Github::Refs).to receive(:update)
      subject.git_push(2, 'some_body', 111, 'Rudolf Steiner', 'rstein@geist.y')
    end

    it 'calls create_blob correctly' do
      expect(subject).to have_received(:create_blob).with('some_body')
    end

    it 'calls create_tree correctly' do
      expect(subject).to have_received(:create_tree).with(2, valid_sha_x, 'latest_tree_sha')
    end

    it 'calls create_commit correctly' do
      expect(subject).to have_received(:create_commit).with(2, valid_sha_y, 'latest_commit_sha', 111, 'Rudolf Steiner', 'rstein@geist.y')
    end

    it 'updates the git ref correctly' do
      expect(Github::Refs).to have_received(:update).with(APP_CONFIG['github_ref'], valid_sha_z)
    end

    it 'returns the correct shas' do
      expect(subject.git_push(2, 'some_body', 111, 'Rudolf Steiner', 'rstein@geist.y')).to match_array([valid_sha_x, valid_sha_z, valid_sha_y])
    end
  end
end
