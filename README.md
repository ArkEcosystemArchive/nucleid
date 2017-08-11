# NUCLeId Npm Universal Command Line Interface
A simple yet powerful package to use command line to use your package

# Quickstart
## installation
`npm install -g nucleid`

## install your favorite package
`npm install -g arkjs`

## use it in cli
```
> nucleid --help

  Usage: nucleid [options] [arguments...]


  Options:

    -r, --require <package>   The package to require
    -e, --execute <function>  The function to execute
    -i, --install <package>   The package to install locally beforehand
    --ijson                   Input argument is well formatted json that should be parsed as object
    --ojson                   Output result is object that should be well formatted json
    -h, --help                output usage information
```

```
> nucleid -r arkjs -e transaction.createTransaction "AN7BURQn5oqBRBADeWhmmUMJGQTy5Seey3" 1000000000 "" 🦄 --ojson
{"type":0,"amount":"1000000000","fee":10000000,"recipientId":"AN7BURQn5oqBRBADeWhmmUMJGQTy5Seey3","timestamp":12272383,"asset":{},"vendorField":"🦄","senderPublicKey":"037699680696ba0f746ee581d775b0ef13a8832fe2539be80eaabff154f3e3995d","signature":"3045022100a801b198bc8719bb953d32d6afbd19bb7df4dde4ec20fee1cb5ec4dd6fe41f4902201a27a7eef2220ca9474c70f57d56dbff81ef64c3e753e5daaad499da68d0b4f8","id":"64f8d7466ae6e7f11401affdbe4dfbd94414670c2ffbb83e8c43e11ac975557e"}
```
