#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Welcome message
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Japan Visa Calculator Deployment Tool  ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo

# Ensure we have the latest dependencies
echo -e "${YELLOW}Checking for dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed! See errors above.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful!${NC}"
echo

# Show build info
echo -e "${YELLOW}Build information:${NC}"
BUILD_SIZE=$(du -sh dist | cut -f1)
FILE_COUNT=$(find dist -type f | wc -l)
echo -e "- Build size: ${GREEN}$BUILD_SIZE${NC}"
echo -e "- Total files: ${GREEN}$FILE_COUNT${NC}"
echo -e "- Build location: ${GREEN}$(pwd)/dist${NC}"
echo

# Provide deployment options
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Your built application is in the ${GREEN}dist${NC} directory"
echo -e "2. Deploy options:"
echo -e "   ${BLUE}•${NC} GitHub Pages: ${GREEN}npm install -g gh-pages && gh-pages -d dist${NC}"
echo -e "   ${BLUE}•${NC} Netlify: ${GREEN}npm install -g netlify-cli && netlify deploy --prod --dir=dist${NC}"
echo -e "   ${BLUE}•${NC} Vercel: ${GREEN}npm install -g vercel && vercel --prod${NC}"
echo -e "   ${BLUE}•${NC} Manual: Upload the ${GREEN}dist${NC} directory to your web host"
echo
echo -e "For detailed deployment instructions, see: ${GREEN}src/deployment-guide.md${NC}"
echo -e "${BLUE}=========================================${NC}"