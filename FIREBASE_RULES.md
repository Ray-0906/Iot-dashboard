# Firebase Realtime Database Rules

Go to Firebase Console → Realtime Database → Rules

Use these rules for testing (allows public read/write):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **For production**, restrict access:

```json
{
  "rules": {
    "sensors": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

After changing rules, click **Publish**.
