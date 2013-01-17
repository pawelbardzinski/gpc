module CommentsHelper
  def wrap_text(txt, col=80, tab=0)
    str=''
    str = '&nbsp;' * tab
    return txt.gsub(/(.{1,#{col}})(?: +|$\n?)|(.{1,#{col}})/,"\\1\\2\n#{str}") 
  end
end
