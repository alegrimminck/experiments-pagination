Rails.application.routes.draw do
  root "home#index"

  namespace :api do
    resource :ping, only: [ :show ]
    resources :products, only: [ :index ]
  end

  get "*path", to: "home#index", constraints: ->(req) { !req.path.start_with?("/api") }
end
