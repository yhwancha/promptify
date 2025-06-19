# AI Prompt Generator

A web application that transforms project ideas into tailored development prompts for AI coding tools.

## 🚀 Key Features

- **Smart Project Analysis**: Uses GPT-4o to analyze project ideas and recommend optimal tech stacks
- **AI Tool Matching**: Recommends the best AI coding tool based on project characteristics (v0.dev, Cursor.ai, GPT Engineer, Claude Dev)
- **Custom Prompt Generation**: Automatically generates prompts optimized for each AI tool's style and capabilities
- **Prompt Editing**: Users can directly modify generated prompts
- **Project History**: Save and manage all generated prompts
- **One-Click Copy**: Copy completed prompts directly to clipboard
- **Multi-language Support**: Korean and English interface

## 🛠 Tech Stack

- **Frontend**: React, Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI Integration**: OpenAI GPT-4o API, Vercel AI SDK
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- OpenAI API key
- Supabase project (optional)

## 🔧 Installation & Setup

### 1. Clone the Project

\`\`\`bash
git clone <repository-url>
cd ai-prompt-generator
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables Setup

Create a \`.env.local\` file in the project root and configure the following environment variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Open \`.env.local\` and update with actual values:

\`\`\`env
# OpenAI API Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (Optional - uses memory storage if not configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### 4. Getting OpenAI API Key

1. Sign in to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Click "Create new secret key"
4. Copy the generated key to \`OPENAI_API_KEY\` in \`.env.local\`

### 5. Supabase Setup (Optional)

If you don't use Supabase, the application will use memory-based storage. For persistent storage:

1. Create a new project at [Supabase](https://supabase.com/)
2. Copy API URL and anon key from project settings
3. Run the following script in SQL Editor:

\`\`\`sql
-- Create prompts storage table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project_idea TEXT NOT NULL,
  detected_stack JSONB NOT NULL,
  recommended_tool VARCHAR(50) NOT NULL,
  generated_prompt TEXT NOT NULL,
  final_prompt TEXT,
  is_finalized BOOLEAN DEFAULT FALSE,
  user_session VARCHAR(255)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prompts_user_session ON prompts(user_session);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
\`\`\`

### 6. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🚀 Deployment

### Vercel Deployment

1. Connect project to [Vercel](https://vercel.com/)
2. Configure environment variables:
   - \`OPENAI_API_KEY\`: OpenAI API key
   - \`NEXT_PUBLIC_SUPABASE_URL\`: Supabase project URL (optional)
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: Supabase anon key (optional)
   - \`SUPABASE_SERVICE_ROLE_KEY\`: Supabase service role key (optional)
3. Deploy

## 📖 How to Use

### 1. Enter Project Idea
- Input your project idea in natural language on the homepage
- Can be a simple description or detailed requirements

### 2. Review AI Analysis Results
- Check recommended tech stack
- Review optimal AI coding tool recommendation
- Read AI's reasoning

### 3. Edit and Save Prompt
- Modify the generated prompt as needed
- Copy to clipboard or save to history

### 4. Manage History
- View all previously generated prompts
- Reuse and manage saved prompts

## 🎯 Supported AI Tools

- **v0.dev**: Optimized for React/Next.js UI component development
- **Cursor.ai**: Optimized for full-stack application development
- **GPT Engineer**: Build complete applications from scratch
- **Claude Dev**: Complex logic and architecture design

## 🔍 API Endpoints

- \`POST /api/analyze\`: Analyze project ideas
- \`POST /api/prompts\`: Save prompts
- \`GET /api/prompts\`: Retrieve prompt history
- \`PUT /api/prompts/[id]\`: Update prompts

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is distributed under the MIT License. See \`LICENSE\` file for details.

## 🐛 Troubleshooting

### Common Issues

**Q: OpenAI API calls are failing**
A: 
- Verify API key is correctly configured
- Check if OpenAI account has sufficient credits
- Verify network connection

**Q: Supabase connection issues**
A:
- Verify Supabase URL and keys are correct
- Check if database tables are created
- App works with memory storage without Supabase

**Q: Prompts are not being saved**
A:
- Check browser console for error messages
- Check network tab for API call status
- Verify environment variable configuration

### Checking Logs

In development mode, you can check detailed logs in browser console and terminal.

## 📞 Support

If you encounter issues or have questions, please contact us through GitHub Issues.

---

**Made with ❤️ using Next.js, OpenAI, and Supabase**
