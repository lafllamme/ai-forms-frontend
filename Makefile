
# Install packages through pnpm
install:
	pnpm install

# Build the project
build:
	pnpm build

# Run the project
run:
	pnpm run dev

clean:
	# Clean the project
	scripts/clean.sh

# Install & run the project
up:
	pnpm install && pnpm run dev

# Run tests
test:
	pnpm test

# Build types with prepare script
prepare:
	pnpm prepare

# Lint the project
lint:
	pnpm lint