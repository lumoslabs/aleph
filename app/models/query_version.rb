class QueryVersion < ActiveRecord::Base
  acts_as_paranoid
  has_many :results, dependent: :destroy
  has_many :visualizations, dependent: :destroy
  has_many :query_roles, through: :query
  belongs_to :query, touch: true, inverse_of: :query_versions
  belongs_to :user

  validates_presence_of :version, :query
  validates :version, numericality: { only_integer: true }
  before_validation :strip_carriage_returns

  if Github.enabled?
    before_create :github_save
  end

  scope :with_role, ->(role) { references(:query).includes(:query_roles).where(query_roles: { role: role }) }

  delegate :to_csv, to: :latest_completed_result

  serialize :parameters, JSON

  def compile(options = {})
    substitution_values = options[:substitution_values] || {}
    SQLCompiler.new(body: body, parameters: compilable_parameters).compile(substitution_values)
  end

  def compilable_parameters
    parameters.map { |p| CompilableParameter.new(p) }
  end

  def latest_completed_result
    results.completed.last
  end

  def author_name
    user.try(:name) || ''
  end

  def email_address
    user.try(:email) || ''
  end

  def add_result(result)
    results << result
  end

  private

  def strip_carriage_returns
    body.try(:gsub!, "\r\n", "\n")
  end

  def github_save
    self.blob_sha, self.commit_sha, self.tree_sha = Github.pusher.git_push(query_id, body, version, author_name, email_address)
  end

  def summary
    { results: results.size }
  end
end
