tmux new-session -d -s resource-build
tmux split-window -h -t resource-build
tmux send-keys -t resource-build:0.0 "docker build -t resource-api -f ./api/Dockerfile ." C-m
tmux send-keys -t resource-build:0.1 "docker build -t resource-consumer -f ./consumer/Dockerfile ." C-m
tmux attach-session -t resource-build