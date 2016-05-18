class SnippetsController < ApplicationController
  respond_to :json

  wrap_parameters :snippet, include: [:name, :content]
  before_filter :retrieve_snippet, only: [:update, :show, :destroy]

  def create
    respond_to do |format|
      format.json do
        snippet = Snippet.create(snippet_params.merge(user_id: current_user.id))

        if snippet.errors.any?
          render json: snippet.errors.full_messages, status: :unprocessable_entity
        else
          render json: snippet, status: :created
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @snippet.update_attributes!(snippet_params)

        if @snippet.errors.any?
          render json: @snippet.errors.full_messages, status: :unprocessable_entity
        else
          render json: @snippet
        end
      end
    end
  end

  def show
    respond_to do |format|
      format.json { render json: @snippet }
      format.html { render template: 'application/index' }
    end
  end

  def index
    respond_to do |format|
      format.html
      format.json { render json: Snippet.all }
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @snippet.destroy!
        render json: @snippet
      end
    end
  end

  private

  def retrieve_snippet
    @snippet = Snippet.find(params[:id])
  end

  def snippet_params
    params.require(:snippet).permit(:name, :content)
  end
end
