class CreateProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :products do |p|
      p.string :name
      p.text :description
      p.integer :price

      p.timestamps
    end
  end
end
