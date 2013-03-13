require 'em-websocket'

EM.run {
  EM::WebSocket.run(:host => "localhost", :port => 8080) do |ws|
    mtime = prev_mtime = File.mtime("/tmp5/touch.txt") 
    while (1) {
      mtime = File.mtime("/tmp5/touch.txt") 
      if mtime != prev_mtime
        prev_mtime = mtime
        data = File.read('/tmp5/latest_data.csv')
        ws.onopen { |handshake|
      # puts "WebSocket connection open"

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
          ws.send data
        }
      }

#    ws.onclose { puts "Connection closed" }

#    ws.onmessage { |msg|
#      puts "Recieved message: #{msg}"
#      ws.send "Pong: #{msg}"
    }
    sleep 1
  end
}