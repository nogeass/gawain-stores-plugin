# gawain-stores-plugin

STORES plugin for Gawain video generation API - reference implementation.

## Overview

This plugin enables STORES merchants to generate product videos using the Gawain API. It provides:

- **Anonymous previews**: Generate video previews without login using `install_id`
- **STORES integration**: Convert STORES product data to Gawain format
- **Commercial upgrade path**: Easy upgrade to commercial usage via Kinosuke

STORES (https://stores.jp/) is a popular Japanese e-commerce platform that makes it easy to create online stores.

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/nogeass/gawain-stores-plugin.git
cd gawain-stores-plugin

# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your Gawain API credentials
```

### Run Demo

```bash
# Using npm
npm run demo -- --product ./samples/product.sample.json

# Using make
make demo
```

### Docker

```bash
# Build and run
docker-compose run --rm app
```

## How It Works

```
+-----------------+
| STORES Product  |
|     (JSON)      |
+--------+--------+
         |
         v
+-----------------+     +-----------------+
|    STORES       |     |    Install ID   |
|    Adapter      |     |   (Anonymous)   |
+--------+--------+     +--------+--------+
         |                       |
         +-----------+-----------+
                     |
                     v
           +-----------------+
           |   Gawain API    |
           |  Create Job     |
           +--------+--------+
                    |
                    v (poll)
           +-----------------+
           |  Preview URL    |
           |  + Upgrade URL  |
           +-----------------+
```

1. **Load product**: Read STORES product JSON
2. **Convert format**: Transform to Gawain API format
3. **Get install_id**: Use existing or generate new anonymous ID
4. **Create job**: Submit to Gawain API for video generation
5. **Poll status**: Wait for completion
6. **Get URLs**: Receive preview URL and Kinosuke upgrade URL

## Commercial Usage

This plugin generates **preview videos** for free. For commercial usage:

1. Run the demo to generate a preview
2. The output includes a Kinosuke upgrade URL with your `install_id`
3. Subscribe at Kinosuke to unlock commercial features
4. Your `install_id` will be linked to your Kinosuke account

## Project Structure

```
gawain-stores-plugin/
+-- docs/
|   +-- architecture.md    # System design
|   +-- api_contract.md    # API specifications
|   +-- local_dev.md       # Development guide
|   +-- security.md        # Security considerations
+-- samples/
|   +-- product.sample.json
+-- src/
|   +-- gawain/            # API client
|   +-- install/           # Install ID management
|   +-- platform/          # Platform adapters
|   +-- util/              # Utilities
|   +-- demo.ts            # CLI demo
|   +-- index.ts           # Exports
+-- Dockerfile
+-- docker-compose.yml
+-- Makefile
+-- package.json
```

## Configuration

Environment variables (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `GAWAIN_API_BASE` | Yes | Gawain API base URL |
| `GAWAIN_API_KEY` | Yes | API key |
| `GAWAIN_APP_ID` | No | Application ID |
| `KINOSUKE_UPGRADE_URL` | No | Upgrade URL |

## Development

```bash
# Run tests
npm test

# Lint
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

## STORES Product Format

STORES products have a specific JSON format:

```json
{
  "id": "item_abc123",
  "name": "Product Name",
  "description": "Product description",
  "price": 2980,
  "images": [
    { "url": "https://example.com/image.jpg" }
  ],
  "variants": [
    { "id": "var_1", "name": "Color", "options": ["Red", "Blue"] }
  ],
  "published": true
}
```

The adapter converts this to Gawain's expected format automatically.

## Disclaimer

This is a **reference implementation** for demonstration purposes. It is not an official STORES app and has not undergone STORES app review.

For production use:
- Implement proper STORES OAuth (if available)
- Add error handling for your use case
- Subscribe to Kinosuke for commercial video generation

## License

Licensed under GNU AGPL v3.0. See [LICENSE](./LICENSE).

## Support

- Issues: [GitHub Issues](https://github.com/nogeass/gawain-stores-plugin/issues)
- Security: See [SECURITY.md](./SECURITY.md)
