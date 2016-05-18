class SimpleCache
  def initialize
    @cache = {}
  end

  def get(key)
    @cache.key?(key) ? @cache[key] : @cache[key] = new_object(key)
  end

  def bust
    @cache.clear
  end
end
