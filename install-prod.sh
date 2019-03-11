#!/bin/bash

server=davidl@88.99.118.38

s=$(readlink -f $0)
cd ${s%/*}

echo "+++++ clear deployment folder on server" && \
	ssh $server << EOF
		mkdir -p ~/website/citrus && \\
		cd ~/website/citrus && \\
		rm -rf citrus-server && \\
		git clone https://github.com/david-0/citrus-server.git && \\
		cd citrus-server && \\
		npm install && \\
		npm run build && \\
		[ -e ../citrus-client/dist/client ] && cp -pPr citrus-client/dist/client dist && \\
		cd .. && \\
		mv -f citrus-server prod
EOF

