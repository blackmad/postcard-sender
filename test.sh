#!/bin/sh


curl --header "Content-Type: application/json"   --request POST  \
--data '{ \
  "from": { "name": "David Blackman", "address_line1": "123 Main St", "address_city": "Brooklyn", "address_state": "NY", "address_zip": "11206", "address_country": "USA" } \
  "to": { "name": "David Blackman", "address_line1": "123 Main St", "address_city": "Brooklyn", "address_state": "NY", "address_zip": "11206", "address_country": "USA" } 
}' \

localhost:3000/send