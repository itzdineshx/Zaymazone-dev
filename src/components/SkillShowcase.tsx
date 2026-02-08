import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const skills = [
  {
    id: 1,
    title: "Pottery & Ceramics",
    description: "Master the ancient art of clay shaping and ceramic glazing techniques passed down through generations.",
    image: '/assets/pottery-hero.jpg',
    artisans: 156,
    experience: "2000+ years",
    techniques: ["Wheel throwing", "Hand building", "Glazing", "Firing"],
    difficulty: "Beginner to Expert",
    icon: "🏺"
  },
  {
    id: 2,
    title: "Handloom Weaving",
    description: "Create stunning textiles using traditional looms and time-honored weaving patterns.",
    image: '/assets/textiles-hero.jpg',
    artisans: 243,
    experience: "3000+ years",
    techniques: ["Plain weave", "Twill", "Jacquard", "Ikat"],
    difficulty: "Intermediate",
    icon: "🧵"
  },
  {
    id: 3,
    title: "Metal Crafting",
    description: "Forge beautiful objects using traditional metalworking techniques and modern innovations.",
    image: '/assets/crafts-hero.jpg',
    artisans: 89,
    experience: "4000+ years",
    techniques: ["Dhokra casting", "Repoussé", "Chasing", "Patina"],
    difficulty: "Advanced",
    icon: "⚒️"
  }
];

export const SkillShowcase = () => {
  return (
    <section className="relative py-20 bg-gradient-subtle dark:bg-gradient-to-br dark:from-background/95 dark:via-primary/3 dark:to-primary-glow/5 overflow-hidden">
      {/* Skill showcase dark mode enhancement */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/[0.01] to-primary-glow/[0.02] dark:from-transparent dark:via-primary/[0.02] dark:to-primary-glow/[0.04] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--primary))_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.005] dark:opacity-[0.01] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Master Traditional Crafts
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Learn from master artisans who have preserved these ancient techniques for generations. 
            Each craft tells a story of cultural heritage and artistic excellence.
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={skill.image}
                    alt={skill.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {skill.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {skill.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {skill.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{skill.artisans} artisans</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{skill.experience}</span>
                      </div>
                    </div>

                    {/* Techniques */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-foreground mb-2">Key Techniques:</h4>
                      <div className="flex flex-wrap gap-1">
                        {skill.techniques.map((technique, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full group" asChild>
                    <Link to="/artisans">
                      Learn from Masters
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Join Our Global Artisan Community
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connect with master craftspeople from around the world, share your creations, 
            and be part of preserving these beautiful traditions for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/seller-onboarding">
                Start Your Journey
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/artisans">
                Meet Our Artisans
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};