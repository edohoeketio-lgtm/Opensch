# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e6]
      - heading "Welcome to OpenSch" [level=1] [ref=e8]
      - paragraph [ref=e9]: Sign in to access the Academic Operating System.
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Email Address
          - textbox "Email Address" [ref=e14]:
            - /placeholder: name@example.com
        - button "Continue with Email" [ref=e15]
      - generic [ref=e20]: Or continue with
      - generic [ref=e21]:
        - button "GitHub" [ref=e22]:
          - img [ref=e23]
          - generic [ref=e25]: GitHub
        - button "Google" [ref=e26]:
          - img [ref=e27]
          - generic [ref=e32]: Google
    - generic [ref=e33]:
      - paragraph [ref=e34]:
        - text: Don't have an account?
        - button "Sign up" [ref=e35]
      - paragraph [ref=e36]:
        - text: By continuing, you agree to our
        - link "Terms of Service" [ref=e37] [cursor=pointer]:
          - /url: "#"
        - text: and
        - link "Privacy Policy" [ref=e38] [cursor=pointer]:
          - /url: "#"
        - text: .
  - button "Open Next.js Dev Tools" [ref=e44] [cursor=pointer]:
    - img [ref=e45]
  - alert [ref=e49]
```