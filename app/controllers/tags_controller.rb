class TagsController < ApplicationController
  respond_to :json

  def index
    respond_to do |format|
      format.json do
        tags = begin
          if params[:search]
            ActsAsTaggableOn::Tag.distinct.where('name LIKE ?', "%#{params[:search]}%").pluck(:name)
          else
            ActsAsTaggableOn::Tag.distinct.pluck(:name)
          end
        end

        render json: tags
      end
    end
  end
end
