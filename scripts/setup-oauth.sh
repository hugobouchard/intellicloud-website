#!/bin/bash

# IntelliCloud Supabase OAuth Setup Script
# This script automates the Google OAuth setup process

set -e  # Exit on error

echo "🚀 IntelliCloud Supabase OAuth Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed${NC}"
    echo "Installing gcloud CLI..."
    brew install --cask google-cloud-sdk
fi

echo -e "${GREEN}✓ gcloud CLI is installed${NC}"
echo ""

# Authenticate with gcloud
echo "📝 Step 1: Authenticate with Google Cloud"
echo "This will open a browser window for authentication..."
read -p "Press Enter to continue..."

gcloud auth login

echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# List projects
echo "📋 Step 2: Select or Create a Google Cloud Project"
echo ""
echo "Existing projects:"
gcloud projects list

echo ""
read -p "Enter existing project ID or press Enter to create new: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    # Create new project
    DEFAULT_PROJECT_ID="intellicloud-oauth-$(date +%s)"
    read -p "Enter new project ID (default: $DEFAULT_PROJECT_ID): " NEW_PROJECT_ID
    PROJECT_ID=${NEW_PROJECT_ID:-$DEFAULT_PROJECT_ID}

    echo "Creating project: $PROJECT_ID"
    gcloud projects create $PROJECT_ID --name="IntelliCloud OAuth"

    echo -e "${YELLOW}⚠️  You need to enable billing for this project${NC}"
    echo "Go to: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
    read -p "Press Enter after enabling billing..."
fi

# Set active project
echo "Setting active project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo -e "${GREEN}✓ Project configured${NC}"
echo ""

# Enable APIs
echo "🔌 Step 3: Enable Required APIs"
echo "Enabling Google+ API..."
gcloud services enable plus.googleapis.com

echo "Enabling IAM API..."
gcloud services enable iam.googleapis.com

echo "Enabling Cloud Resource Manager API..."
gcloud services enable cloudresourcemanager.googleapis.com

echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# OAuth Consent Screen
echo "🔐 Step 4: Configure OAuth Consent Screen"
echo ""
echo -e "${YELLOW}⚠️  You must configure the OAuth consent screen manually${NC}"
echo ""
echo "1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=$PROJECT_ID"
echo "2. Select 'External' user type"
echo "3. Fill in the required fields:"
echo "   - App name: IntelliCloud Admin"
echo "   - User support email: your@intellicloud.com"
echo "   - Developer contact: your@intellicloud.com"
echo "4. Add scopes: email, profile, openid"
echo "5. Add test users: your@intellicloud.com"
echo ""
read -p "Press Enter after configuring the consent screen..."

echo -e "${GREEN}✓ Consent screen configured${NC}"
echo ""

# Create OAuth Client
echo "🔑 Step 5: Create OAuth 2.0 Client ID"
echo ""
echo -e "${YELLOW}⚠️  You must create the OAuth client manually${NC}"
echo ""
echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo "2. Click 'Create Credentials' → 'OAuth 2.0 Client ID'"
echo "3. Application type: Web application"
echo "4. Name: IntelliCloud Supabase Auth"
echo "5. Authorized redirect URIs:"
echo "   https://qbvtpfcfcxgrusfxfqhd.supabase.co/auth/v1/callback"
echo "6. Click 'Create'"
echo ""
read -p "Press Enter after creating the OAuth client..."

echo ""
read -p "Enter the Client ID: " CLIENT_ID
read -p "Enter the Client Secret: " CLIENT_SECRET

echo -e "${GREEN}✓ OAuth credentials created${NC}"
echo ""

# Configure Supabase
echo "📦 Step 6: Configure Supabase"
echo ""
echo "Supabase Configuration:"
echo "1. Go to: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/auth/providers"
echo "2. Find and enable 'Google' provider"
echo "3. Enter these credentials:"
echo "   Client ID: $CLIENT_ID"
echo "   Client Secret: $CLIENT_SECRET"
echo ""
read -p "Press Enter after configuring Supabase..."

echo -e "${GREEN}✓ Supabase configured${NC}"
echo ""

# Get Supabase Anon Key
echo "🔐 Step 7: Update Environment Variables"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/settings/api"
echo "2. Copy the 'anon/public' key"
echo ""
read -p "Enter the Supabase anon key: " SUPABASE_ANON_KEY

# Update .env file
cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://qbvtpfcfcxgrusfxfqhd.supabase.co
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

echo -e "${GREEN}✓ .env file updated${NC}"
echo ""

# Database Setup
echo "🗄️  Step 8: Set Up Database Tables"
echo ""
echo "Run the SQL commands in Supabase SQL Editor:"
echo "https://supabase.com/dashboard/project/qbvtpfcfcxgrusfxfqhd/sql"
echo ""
echo "The SQL file is located at: docs/SUPABASE-OAUTH-SETUP.md"
echo ""
read -p "Press Enter after running the SQL commands..."

echo -e "${GREEN}✓ Database configured${NC}"
echo ""

# Rebuild and Deploy
echo "🚀 Step 9: Rebuild and Deploy"
echo ""
read -p "Do you want to rebuild and deploy now? (y/n): " DEPLOY

if [ "$DEPLOY" = "y" ]; then
    echo "Building project..."
    npm run build

    echo "Deploying to Firebase..."
    firebase deploy --only hosting

    echo -e "${GREEN}✓ Deployed successfully${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Admin Panel: https://site-web-ic.web.app/admin.html"
echo ""
echo "Summary of credentials:"
echo "  Google Project ID: $PROJECT_ID"
echo "  OAuth Client ID: $CLIENT_ID"
echo "  Supabase URL: https://qbvtpfcfcxgrusfxfqhd.supabase.co"
echo ""
echo "For troubleshooting, see: docs/SUPABASE-OAUTH-SETUP.md"
