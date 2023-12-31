class Collection < ApplicationRecord
  belongs_to :user
  has_many :encounter_collections, dependent: :destroy
  has_many :encounters, through: :encounter_collections

  validates :title, presence: true

  def activities
    encounters.map(&:activity)
  end

#   def default(user_id)
#     Encounters.where(user_id: user_id, saved: true)
#   end
end
