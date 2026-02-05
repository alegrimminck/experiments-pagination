class Api::ProductsController < ApplicationController
  def index
    products = Product.order(created_at: :desc).page(params[:page]).per(25)
    render json: {
      products: products.as_json(only: %i[id name description price created_at updated_at]),
      meta: {
        current_page: products.current_page,
        total_pages: products.total_pages,
        total_count: products.total_count
      }
    }
  end
end
