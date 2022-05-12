### Notes

Key benefits for Redwood:

- SPEED! Testing and building is done in parallel
- INSTANT Docker builds once tests pass (previously 15+ min)
- Run docker images side-by-side before publishing
- Run migrations

Gotchas when using Earthly:

- Any command with `output`, or uses `--push` will only produce output if called directly, `earthly --push +target-with-push` or via a `BUILD` command

### Setup

https://earthly.dev/get-earthly

```
earthly github.com/earthly/hello-world+hello
```

### Testing

```bash



```
