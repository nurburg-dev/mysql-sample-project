---
title: "Implement an API ratelimiter in Nodejs"
tags:
  - mysql
summary: "Ratelimitter are middlewares which disallow api access to an enpoint if the number of API requests cross a certain number per minute. In this assignment you will be implementing an API ratelimiter in nodejs."
author: Anunay Biswas
authorTitle: founder, nurburg.dev
authorLink: https://www.linkedin.com/in/anunay-biswas-26206539/
publishedOn: 2025-09-04
published: false
---

## Problem Statement

You need to implement an API rate limiter in Node.js that can limit the number of request to backend services `service-a` and `service-b`.

The application consists of:

- **Main API Server**: Express.js application with rate limiting middleware
- **Service A**: Backend service running in devcontainer
- **Service B**: Backend service running in devcontainer
- **Redis**: Optional Redis setup provided. Could be used in your architecture if you like.

Following functionality should be ensured.

1. `POST /api/a/*` - Routes to Service A with rate limiting
2. `POST /api/b/*` - Routes to Service B with rate limiting
3. Each backend service has independent rate limiting.

## Development Setup

### Express.js Development

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.dev .env
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Application URL**
   - Local server: http://localhost:3000

## Database Services

### Redis

- **Host**: ts-rate-limiterredis
- **Port**: 6379
- **Database**: 0

## Development Workflow

1. Make your changes to the code
2. Test locally using the development server
3. Ensure all tests pass
4. Deploy using the production configuration

## Production Deployment

The application uses `.env.prod` for production environment variables with Kubernetes service names for database connections.


# Enhanced Code Blocks Demo

This document showcases the different types of enhanced code blocks available with the lowlight integration.

## 1. Basic Code Blocks

### Simple JavaScript
```javascript
function greetUser(name) {
  return `Hello, ${name}! Welcome to our platform.`;
}

const user = { id: 1, name: "Alice" };
console.log(greetUser(user.name));
```

### TypeScript Interface
```typescript
interface UserProfile {
  id: number;
  username: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}
```

## 2. GitHub-Linked Code Blocks

### Real GitHub Example - Button Component
```typescript
// Source: https://github.com/nurburg-platform/application/blob/main/src/components/shadcn/button.tsx
// File: src/components/shadcn/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/shadcnUtils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
```

### GitHub Example with File Path and Line Numbers
```typescript
// Source: https://github.com/nurburg-platform/application/blob/main/src/lib/parsers.ts
// File: src/lib/parsers.ts
// Lines: 82-110
// show-line-numbers
export async function parseMarkdown(markdown: string) {
    const { content, data: frontmatter } = matter(markdown);
    const fmData = ContentMetadata.parse(frontmatter);
    const slugger = new GithubSlugger();
    const toc: TableOfContentItem[] = [];

    const file = await unified()
        .use(remarkParse)
        .use(() => (tree) => {
            visit(tree, "heading", ({ children, depth }: Heading) => {
                const text = children
                    .filter((child): child is { type: "text"; value: string } =>
                        child.type === "text" || child.type === "inlineCode")
                    .map((child) => child.value)
                    .join("");

                toc.push({ depth, text, slug: slugger.slug(text) });
            });
        })
        .use(remarkRehype)
        .use(rehypeSanitize, defaultSchema)
        .use(rehypeHighlight)
        .use(rehypeEnhancedCodeBlocks)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(content);

    return {
        frontmatter: fmData,
        toc,
        html: file.toString(),
    };
}
```

## 3. Backend Code Examples

### Go HTTP Handler
```go
// Source: https://github.com/example/api-server/blob/main/internal/handlers/users.go
// File: internal/handlers/users.go
// Lines: 45-70
// show-line-numbers
func (h *UserHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
    userID := mux.Vars(r)["id"]

    user, err := h.userService.GetByID(r.Context(), userID)
    if err != nil {
        if errors.Is(err, ErrUserNotFound) {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }
        h.logger.Error("failed to get user", "error", err, "user_id", userID)
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    profile := UserProfileResponse{
        ID:       user.ID,
        Username: user.Username,
        Email:    user.Email,
        JoinedAt: user.CreatedAt,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(profile)
}
```

### Python Data Processing
```python
// Source: https://github.com/example/data-pipeline/blob/main/src/processors/user_analytics.py
// File: src/processors/user_analytics.py
// show-line-numbers
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class UserAnalyticsProcessor:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cache = {}

    def calculate_user_engagement(self, user_id: str, days: int = 30) -> Dict:
        """Calculate user engagement metrics for the specified period."""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Fetch user activity data
        query = """
        SELECT action_type, timestamp, metadata
        FROM user_activities
        WHERE user_id = %s AND timestamp BETWEEN %s AND %s
        ORDER BY timestamp DESC
        """

        activities = pd.read_sql(
            query,
            self.db,
            params=[user_id, start_date, end_date]
        )

        if activities.empty:
            return {"engagement_score": 0, "active_days": 0}

        # Calculate metrics
        unique_days = activities['timestamp'].dt.date.nunique()
        total_actions = len(activities)
        engagement_score = (unique_days / days) * (total_actions / 100)

        return {
            "engagement_score": round(engagement_score, 2),
            "active_days": unique_days,
            "total_actions": total_actions,
            "period_days": days
        }
```

## 4. Database and Configuration

### SQL with Line Numbers
```sql
// show-line-numbers
-- User engagement analytics view
CREATE VIEW user_engagement_summary AS
SELECT
    u.id,
    u.username,
    u.email,
    COUNT(DISTINCT DATE(ua.timestamp)) as active_days,
    COUNT(ua.id) as total_actions,
    AVG(s.score) as avg_session_score,
    MAX(ua.timestamp) as last_activity
FROM users u
LEFT JOIN user_activities ua ON u.id = ua.user_id
LEFT JOIN user_sessions s ON u.id = s.user_id
WHERE ua.timestamp >= NOW() - INTERVAL 30 DAY
GROUP BY u.id, u.username, u.email
HAVING active_days > 0
ORDER BY active_days DESC, total_actions DESC;
```

### Docker Configuration
```dockerfile
// Source: https://github.com/nurburg-platform/application/blob/main/Dockerfile
// File: Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

## 5. Configuration Files

### YAML Configuration
```yaml
// From: https://github.com/example/k8s-configs/blob/main/deployment.yaml
// Path: k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nurburg-platform
  labels:
    app: nurburg-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nurburg-platform
  template:
    metadata:
      labels:
        app: nurburg-platform
    spec:
      containers:
      - name: application
        image: nurburg-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### JSON Configuration
```json
// File: package.json
{
  "name": "nurburg-platform",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.5.4",
    "react": "^19.2.0",
    "lowlight": "^3.3.0",
    "rehype-highlight": "^7.0.2"
  }
}
```

## 6. Mixed Language Example

### Shell Script with GitHub Link
```bash
// Source: https://github.com/nurburg-platform/infrastructure/blob/main/scripts/deploy.sh
// File: scripts/deploy.sh
// show-line-numbers
#!/bin/bash

set -e

echo "🚀 Starting deployment process..."

# Build and tag Docker image
IMAGE_TAG="nurburg-platform:$(git rev-parse --short HEAD)"
echo "Building image: $IMAGE_TAG"

docker build -t $IMAGE_TAG .
docker tag $IMAGE_TAG nurburg-platform:latest

# Push to registry
echo "Pushing to registry..."
docker push $IMAGE_TAG
docker push nurburg-platform:latest

# Deploy to Kubernetes
echo "Deploying to Kubernetes..."
kubectl set image deployment/nurburg-platform application=$IMAGE_TAG
kubectl rollout status deployment/nurburg-platform

echo "✅ Deployment completed successfully!"
```

  [![🚀 Fork Email Server](https://img.shields.io/badge/🚀_Fork-Email_Server-0070f3?style=for-the-badge)](https://nurburg.dev/nurburg-dev/projects:0001-email-rate-limiter)
