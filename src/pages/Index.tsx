
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Sample data - in a real app, this would come from an API
  const samplePosts = [
    {
      id: '1',
      author: {
        name: 'Dr. Elena Vasquez',
        username: 'elena_physics',
        field: 'Theoretical Physics',
        verified: true
      },
      content: 'Just published our latest findings on quantum entanglement in macroscopic systems! The implications for quantum computing are fascinating. What do you think about the potential for room-temperature quantum processors?',
      timestamp: '2h',
      category: 'Physics' as const,
      likes: 127,
      comments: 23,
      reposts: 45,
      hashtags: ['QuantumPhysics', 'Research', 'QuantumComputing']
    },
    {
      id: '2',
      author: {
        name: 'Prof. Marcus Chen',
        username: 'biotech_marcus',
        field: 'Biotechnology',
        verified: true
      },
      content: 'CRISPR-Cas9 breakthrough: We\'ve successfully edited genes in living organisms with 99.7% precision! This could revolutionize treatment for genetic disorders. Peer review process starting next week.',
      timestamp: '4h',
      category: 'Biology' as const,
      likes: 234,
      comments: 67,
      reposts: 89,
      hashtags: ['CRISPR', 'GeneEditing', 'Biotechnology', 'MedicalBreakthrough']
    },
    {
      id: '3',
      author: {
        name: 'Sarah Kim',
        username: 'ai_sarah',
        field: 'Machine Learning',
        verified: false
      },
      content: 'Working on a neural network that can predict protein folding with 95% accuracy. The computational chemistry applications are endless! Open sourcing the model next month.',
      timestamp: '6h',
      category: 'Technology' as const,
      likes: 156,
      comments: 34,
      reposts: 67,
      hashtags: ['MachineLearning', 'ProteinFolding', 'OpenSource', 'AI']
    },
    {
      id: '4',
      author: {
        name: 'Dr. Ahmed Hassan',
        username: 'climate_ahmed',
        field: 'Climate Science',
        verified: true
      },
      content: 'Our Antarctic ice core analysis reveals unprecedented CO2 patterns from the last millennium. The data shows accelerating changes in the past 50 years. Full dataset available on our research portal.',
      timestamp: '8h',
      category: 'Chemistry' as const,
      likes: 298,
      comments: 91,
      reposts: 145,
      hashtags: ['ClimateScience', 'Antarctica', 'CO2', 'Research', 'DataScience']
    },
    {
      id: '5',
      author: {
        name: 'Dr. Lisa Rodriguez',
        username: 'math_lisa',
        field: 'Pure Mathematics',
        verified: true
      },
      content: 'Proved a new theorem in algebraic topology today! The applications to quantum field theory are surprisingly elegant. Mathematics continues to be the language of the universe. 🧮✨',
      timestamp: '12h',
      category: 'Mathematics' as const,
      likes: 89,
      comments: 15,
      reposts: 23,
      hashtags: ['Mathematics', 'AlgebraicTopology', 'QuantumFieldTheory', 'PureMath']
    }
  ];

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="max-w-2xl mx-auto pb-20 md:pb-4">
        {/* Welcome Header */}
        <div className="glass-card p-6 mb-6 text-center fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome to STEMSphere
          </h2>
          <p className="text-muted-foreground">
            Connect with scientists, researchers, and STEM enthusiasts worldwide
          </p>
        </div>

        {/* Create Post */}
        <CreatePost />

        {/* Feed */}
        <div className="space-y-0">
          {samplePosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="glass-card px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors text-primary font-medium">
            Load more posts
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
