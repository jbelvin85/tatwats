#!/bin/bash

# This script sends a message to a helper by creating a new message file in their inbox.

SENDER=$1
RECIPIENT=$2
MESSAGE=$3

if [ -z "$SENDER" ] || [ -z "$RECIPIENT" ] || [ -z "$MESSAGE" ]; then
  echo "Usage: $0 <sender> <recipient> <message>"
  exit 1
fi

MESSAGE_ID=$(date +%s%N)
MESSAGE_FILE="/home/user/Github/tatwats/helpers/the_mediator/common_room/$RECIPIENT/inbox/$MESSAGE_ID.json"

cat << EOF > "$MESSAGE_FILE"
{
  "id": "$MESSAGE_ID",
  "sender": "$SENDER",
  "recipient": "$RECIPIENT",
  "message": "$MESSAGE"
}
EOF

echo "Message sent to $RECIPIENT."
