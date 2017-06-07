module Endpoint
  def self.included(base)
    base.class_eval do
      set(:prefix) { "/" << name[/[^:]+$/].downcase }
    end
  end
end