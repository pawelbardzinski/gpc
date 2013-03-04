require 'readability'
require 'open-uri'
require 'nokogiri'

source = open(ARGV[0]).read
str = Readability::Document.new(source).content
@content = Nokogiri::HTML(str).text.strip!.slice(0,300).gsub!("\n"," ").gsub!("\t"," ") + '...'

puts @content
