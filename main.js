"use strict";

const crypto = require("crypto");

module.exports.templateTags = [
  {
    name: "hmac",
    displayName: "SquareHMAC",
    description: "Build a HMAC signature value for a square webhook request",
    args: [
      {
        displayName: "Key",
        type: "string",
        placeholder: "HMAC Secret Key (found in the square webhook configuration)",
      }
    ],
    async run(
      context,
      key = ""
    ) {
      const { meta } = context;

      const hmac = crypto.createHmac('sha1', key);

      const request = await context.util.models.request.getById(
        meta.requestId
      );

      const url = await context.util.render(request.url);
      
      const params = request.parameters.length > 0
        ? `?${request.parameters.map((param) => `${param.name}=${param.value}`).join('&')}`
        : ''

      const body = request.body.text;

      const payload = [url, params, body].join('')

      hmac.write(payload);
      hmac.end()
      
      return `${hmac.read().toString('base64')}`;
    },
  },
];
