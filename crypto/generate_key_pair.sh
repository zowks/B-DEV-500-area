#!/bin/bash

# This script aims to provide functions to generate a public and private key
# pair, mostly used for either SSL context or JWT encryption and decryption.

# This function generates an RSA key pair of a 4096 modulus length used to
# encrypt and decrypt JWTs. It requires openssl to be installed. The generated
# files will be encoded to PEM format.
generate_jwt_key_pair() {
    openssl genrsa -out jwe_private_key.pem 4096
    openssl rsa -in jwe_private_key.pem \
        -pubout -out jwe_public_key.pem
    openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in jwe_private_key.pem -out pkcs8.pem
    rm -f jwe_private_key.pem
    mv pkcs8.pem jwe_private_key.pem
}

# This function generates a random 32 bytes secret key used to sign a JWT. It
# requires xdd to be installed.
random_key() {
    local random=$(head -n 1 /dev/urandom)
    local secret=$(xxd -l 16 -pc <<< "${random}")
    echo "${secret}"
}

generate_jwt_secret() {
    echo $(random_key) > jwt_secret_key.txt
}

generate_express_session_secret() {
    echo $(random_key) > express_session.txt
}

# This function generates an SSL certificate and it's private key in order to
# secure the web connections. It requires openssl to be installed. Be aware
# that the certificate will be self-signed, thus some web browser may alert
# their users that the website may be suspicious, even though it's not.
#
# If you're a developer who is trying to use the application locally, you
# should click a button when trying to access any page to "accept the risks".
# If you're trying to reach the API via a backend service, make sure it's not
# trying to verify the certificate authenticity. For instance, use "-k" with
# curl, or the `verify=False` when using `requests` Python module.
COUNTRY="FR"
STATE="Lille"
LOCALITY="Lille"
ORG="Epitech"
ORG_UNIT="AREA"
COMMON_NAME="localhost"
CONFIG="/C=${COUNTRY}/ST=${STATE}/L=${LOCALITY}/O=${ORG}/OU=${ORG_UNIT}/CN=${COMMON_NAME}"
DAYS=$(( 365 * 1 ))
generate_ssl_context() {
    openssl req -x509               \
        -newkey rsa:4096            \
        -keyout ssl_private_key.pem \
        -out ssl_public_key.pem     \
        -sha512                     \
        -days "${DAYS}"             \
        -nodes                      \
        -subj "${CONFIG}"
}

generate_ssl_context
generate_jwt_secret
generate_express_session_secret
generate_jwt_key_pair
