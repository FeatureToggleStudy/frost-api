export const PoetProto = {
  nested: {
    Poet: {
      nested: {
        Claim: {
          fields: {
            id: {
              type: 'bytes',
              id: 1
            },
            publicKey: {
              type: 'bytes',
              id: 2
            },
            signature: {
              type: 'bytes',
              id: 3
            },
            type: {
              type: 'string',
              id: 4
            },
            dateCreated: {
              type: 'int64',
              id: 5
            },
            attributes: {
              rule: 'repeated',
              type: 'Attribute',
              id: 6
            }
          }
        },
        Block: {
          fields: {
            id: {
              type: 'bytes',
              id: 1
            },
            claims: {
              rule: 'repeated',
              type: 'Claim',
              id: 2
            }
          }
        },
        Attribute: {
          fields: {
            key: {
              type: 'string',
              id: 1
            },
            value: {
              type: 'string',
              id: 2
            }
          }
        }
      }
    }
  }
}
