# issue-linkifier - VSCode extension

Generates clickable links above matching string patterns.

## Configuration

```json
{
  "issueLinkifier.entries": {
    "my-company": {
      "pattern": "MY-COMPANY-[0-9]+",
      "url": "https://my-company.com/jira/browse/"
    },
    ...
  }
}
```

## Preview

![preview](preview.png)
