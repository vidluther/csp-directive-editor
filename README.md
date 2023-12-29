# Content Security Policy Directive Editorcsp
[![Node.js CI](https://github.com/vidluther/csp-directive-editor/actions/workflows/node.js.yml/badge.svg)](https://github.com/vidluther/csp-directive-editor/actions/workflows/node.js.yml)

### Disclaimer

> Most of this code was written by ChatGPT 4.x in an evening, while I was trying to debug the CSP for an existing site that is hosted on Cloudflare pages. Use at your own risk.
This code does not claim to generate a valid CSP, it attempts to help you craft a CSP string, that you can then copy and paste into your site's CSP configuration.


## Overview

The CSP Directive Editor is a Node.js tool designed to simplify the process of managing Content Security Policies (CSP). It addresses the challenge of editing and understanding complex CSP strings, which are often difficult to handle due to their length and lack of structure when presented as a single line of text. This tool allows users to fetch CSP from a given URL, displays the current directives in an organized and readable format, and provides an interactive command-line interface to edit these directives or add new ones.

## Problem Statement

Content Security Policies are a critical part of web application security, helping to prevent various types of attacks like Cross-Site Scripting (XSS) and data injection. However, managing and editing CSPs can be cumbersome, especially when dealing with long and complex policies. This tool aims to make CSP management more accessible and manageable by providing an interactive way to edit CSP directives, view changes in real-time, and understand the structure of a CSP at a glance.


## Features

- Fetch CSP headers directly from URLs.
- Deserialize CSP headers into individual directives for easy reading and editing.
- Interactive command-line interface to edit existing directives or add new ones.
- Serialize edited directives back into a cohesive CSP string.
- Simple and intuitive user interaction model.

## Getting Started

### Prerequisites

- Node.js (version 18.x or higher)
- Internet access for fetching CSP from URLs

### Quick Start

```bash
   git clone https://github.com/vidluther/csp-directive-editor.git
   cd csp-directive-editor
   npm install

   node getcsp.js https://example.com 
```
