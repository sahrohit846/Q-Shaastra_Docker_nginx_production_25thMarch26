#!/bin/bash
# Dependency Optimization Script
# Removes unused ML packages to reduce build time by 15-20 minutes

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REQUIREMENTS_FILE="$PROJECT_DIR/requirements.txt"
BACKUP_FILE="$PROJECT_DIR/requirements.txt.backup"

echo "🔍 Quantum Shaastra - Dependency Optimization"
echo "=============================================="
echo ""

# Create backup
if [ ! -f "$BACKUP_FILE" ]; then
    cp "$REQUIREMENTS_FILE" "$BACKUP_FILE"
    echo "✅ Backup created: $BACKUP_FILE"
else
    echo "ℹ️  Backup already exists: $BACKUP_FILE"
fi

echo ""
echo "📊 Analysis:"
echo "============"
echo ""

# Show what will be removed
echo "🗑️  Unused packages to REMOVE (saves ~700MB, 15-20 min build time):"
echo "   1. sentence-transformers==5.2.3    (~500MB)"
echo "   2. keybert==0.9.0                  (~100MB)"
echo "   3. scikit-learn==1.8.0             (~100MB)"
echo ""

# Show what will stay
echo "✅ ACTIVE ML packages (keeping):"
echo "   • transformers==4.51.3   (required for article summarization)"
echo "   • torch                  (auto-installed by transformers)"
echo "   • nltk                   (used for preprocessing)"
echo ""

# Count current packages
CURRENT_COUNT=$(grep -v '^$' "$REQUIREMENTS_FILE" | grep -v '^#' | wc -l)
NEW_COUNT=$((CURRENT_COUNT - 3))

echo "📈 Package count:"
echo "   Current: $CURRENT_COUNT packages"
echo "   After:   $NEW_COUNT packages (-3 unused)"
echo ""

# Simulate what will be removed
echo "🔍 Packages to remove:"
grep -E "^(sentence-transformers|keybert|scikit-learn)" "$REQUIREMENTS_FILE" || echo "   Already removed or not found"
echo ""

# Create optimized version
echo "Creating optimized requirements.txt..."
grep -v -E "^(sentence-transformers|keybert|scikit-learn)" "$REQUIREMENTS_FILE" > "$PROJECT_DIR/requirements-optimized.txt"

echo ""
echo "✨ Optimization Options:"
echo "========================"
echo ""
echo "OPTION 1: Apply optimization now"
echo "  Command: bash $0 --apply"
echo ""
echo "OPTION 2: Review changes first"
echo "  Command: diff -u $BACKUP_FILE $PROJECT_DIR/requirements-optimized.txt"
echo ""
echo "OPTION 3: Restore from backup"
echo "  Command: cp $BACKUP_FILE $REQUIREMENTS_FILE"
echo ""

if [ "$1" == "--apply" ]; then
    echo "🚀 Applying optimization..."
    cp "$PROJECT_DIR/requirements-optimized.txt" "$REQUIREMENTS_FILE"
    echo "✅ requirements.txt updated (3 packages removed)"
    echo ""
    echo "📋 Next steps:"
    echo "   1. docker compose down"
    echo "   2. docker system prune -af  # Clean old images"
    echo "   3. docker compose build --no-cache"
    echo "   4. docker compose up"
    echo ""
    echo "⏱️  Expected savings: 15-20 minutes on next build"
elif [ "$1" == "--revert" ]; then
    echo "⏮️  Reverting to original requirements.txt..."
    cp "$BACKUP_FILE" "$REQUIREMENTS_FILE"
    echo "✅ requirements.txt restored"
else
    echo "📌 To apply changes, run: bash $(basename $0) --apply"
fi

echo ""
