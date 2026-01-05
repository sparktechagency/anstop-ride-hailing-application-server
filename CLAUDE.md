# Development Commands

## Running the server
- `npm run dev` - Start development server (fast startup, no type checking)
- `npm run dev:typecheck` - Start development server with TypeScript checking
- `npm run typecheck` - Run TypeScript type checking without starting server

## Quality checks
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run format` - Format code with Prettier

## Improvements made
1. **Better error messages**: Routes now validate that handlers are not undefined
2. **TypeScript checking**: Available via `npm run dev:typecheck` and `npm run typecheck`
3. **Enhanced linting**: Added rules to catch empty exports and import issues
4. **Fixed empty route file**: `src/modules/user/user.route.ts` was empty causing the original error