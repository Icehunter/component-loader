module.exports = {
  extends: ['@icehunter/eslint-config'],
  "overrides": [
    {
      "files": [
        "**/*.stories.*"
      ],
      "rules": {
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
};
