"use client";

import "./globals.css";
import React, { useEffect, useRef } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Link from "next/link";

const typedStrings = ["Questions", "Blogs", "Streaks", "News", "Events"];

function useTyped(ref: React.RefObject<HTMLHeadingElement>, strings: string[]) {
  useEffect(() => {
    if (!ref.current) return;
    let i = 0;
    let j = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;
    const type = () => {
      if (!ref.current) return;
      const current = strings[i % strings.length];
      if (isDeleting) {
        ref.current.textContent = current.substring(0, j--);
        if (j < 0) {
          isDeleting = false;
          i++;
          timeout = setTimeout(type, 500);
        } else {
          timeout = setTimeout(type, 50);
        }
      } else {
        ref.current.textContent = current.substring(0, j++);
        if (j > current.length) {
          isDeleting = true;
          timeout = setTimeout(type, 1000);
        } else {
          timeout = setTimeout(type, 100);
        }
      }
    };
    type();
    return () => clearTimeout(timeout);
  }, [ref, strings]);
}

const Page: React.FC = () => {
  const typedRef = useRef<HTMLHeadingElement>(null);
  useTyped(typedRef, typedStrings);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Hero Section */}
      <nav className="flex items-center justify-between px-8 py-2 sticky top-0 z-50 bg-black">
        <a href="#" className="flex items-center">
          <img
            src="/Logo.svg"
            alt="CyMate Logo"
            className="w-40 h-20 relative"
          />
        </a>
        {/* <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-6 text-sm">
            <li>
              <a href="#" className="hover:tracking-wider transition">
                Feature{" "}
                <span>
                  <img
                    src="/Landing_Imgs/Vector.svg"
                    className="inline w-3 h-3"
                  />
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:tracking-wider transition">
                Resources{" "}
                <span>
                  <img
                    src="/Landing_Imgs/Vector.svg"
                    className="inline w-3 h-3"
                  />
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:tracking-wider transition">
                Support{" "}
                <span>
                  <img
                    src="/Landing_Imgs/Vector.svg"
                    className="inline w-3 h-3"
                  />
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:tracking-wider transition">
                Enterprise{" "}
                <span>
                  <img
                    src="/Landing_Imgs/Vector.svg"
                    className="inline w-3 h-3"
                  />
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="hover:tracking-wider transition">
                Streaks and News
              </a>
            </li>
            <li>
              <a href="#" className="hover:tracking-wider transition">
                About Us
              </a>
            </li>
          </ul>
        </div> */}
        <div className="flex space-x-4">
            <Link href="/login" passHref legacyBehavior>
              <a className="bg-[#3d3c3c] text-white w-24 h-10 rounded-full flex items-center justify-center">
                Login
              </a>
            </Link>
            <Link href="/register" passHref legacyBehavior>
              <a className="bg-white text-black w-24 h-10 rounded-full flex items-center justify-center">
                Sign Up
              </a>
            </Link>
        </div>
      </nav>
      <div className="bg-gradient-to-br from-black via-[#040404] to-[#531c9a] relative">
        {/* Navbar */}

        {/* Main Home */}
        <main className="container mx-auto px-4">
          <section
            className="flex flex-col items-center justify-center mt-16"
            id="home"
          >
            <header>
              <p className="text-[#ae70ff] text-2xl font-semibold text-center max-w-md">
                Develop & Defend Together
              </p>
            </header>
            <article>
              <h1 className="text-center text-4xl md:text-4xl font-extrabold max-w-3xl mb-6 mt-6">
                Step Into The New Era Of Cybersecurity & Developer Innovation
              </h1>
            </article>
            {/* <div className="action w-full flex justify-center">
              <div className="flex bg-[#3d3c3c] rounded-2xl p-2 min-w-[400px] mt-2">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="flex-1 bg-[#3d3c3c] text-white rounded-2xl px-4 py-2 outline-none"
                />
                <button className="bg-white text-black font-bold rounded-2xl px-4 py-2 ml-2 hover:bg-violet-600 transition duration-300 flex items-center">
                  Get notified
                  <span className="ml-2">
                    <img
                      src="/Landing_Imgs/Send .svg"
                      alt="Send"
                      className="w-5 h-5"
                    />
                  </span>
                </button>
              </div>
            </div> */}
            <div className="home-img mt-8 w-full flex justify-center">
              <img
                src="/Landing_Imgs/Toolkit.png"
                alt="toolkit"
                className="max-w-4xl w-full "
              />
            </div>
          </section>
        </main>
      </div>

      {/* Features Section */}
      <section className="features relative py-16" id="features">
        <div className="container mx-auto px-4">
          <div className="features-head flex flex-col items-center pb-4">
            <h2 className="text-[#ae70ff] text-5xl font-semibold mb-8">
              Features
            </h2>
            <p className="text-center text-2xl font-extrabold mb-8 max-w-5xl">
              All-in-one platform for automated cybersecurity, collaborative
              community building and development inspiration
            </p>
          </div>
          <div className="features-content">
            {/* Row 1 */}
            <div className="flex flex-col justify-center items-center md:flex-row gap-8 mb-8">
              {/* Card 1 */}
              <div className="features-card glass-effect flex flex-col justify-between p-6 rounded-2xl w-full md:w-[640px] h-[400px] relative bg-white/10 border border-white/20 backdrop-blur">
                <div className="top-card">
                  <h3 className="bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent text-2xl font-extrabold mb-20">
                    Welcome to the Hub of Innovation and Community
                  </h3>
                  <p className="text-lg font-semibold mb-4">
                    How about exploring something new today?
                  </p>
                  <h2
                    ref={typedRef}
                    className="multiple-text border-2 border-white text-2xl font-semibold p-4 mt-8 w-80 h-20 whitespace-nowrap overflow-hidden bg-transparent"
                  />
                </div>
                <div className="bottom-card absolute  bottom-0 right-3">
                  <div>
                    <img
                      src="/Landing_Imgs/Phone(Features).png"
                      alt="Phone Features"
                      className="w-48"
                    />
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="features-card-1 glass-effect flex flex-row justify-around rounded-2xl w-full md:w-[640px] h-[400px] bg-white/10 border border-white/20 backdrop-blur">
                <div className="left-card flex flex-col gap-2 w-[215px] justify-center">
                  <img
                    src="/Landing_Imgs/streaks.png"
                    alt="Streaks"
                    className="w-full"
                  />
                </div>
                <div className="right-card flex flex-col py-6 justify-center">
                  <h3 className="bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent text-3xl font-extrabold mt-4 mb-4 text-left">
                    Streaks
                  </h3>
                  <p className="text-left text-md font-semibold mt-2 max-w-xs">
                    Streaks bring the most important updates in cybersecurity,
                    technology, and community highlights directly to the
                    forefront of the CyMate platform. Whether it's breaking news
                    about global vulnerabilities, industry advancements, or
                    outstanding contributions from our users, Streaks ensure you
                    never miss what matters most.
                  </p>
                </div>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col gap-8 mb-8">
              <div className="features-card-2 glass-effect flex flex-row items-center justify-center p-6 rounded-3xl w-full max-h-[311px] bg-white/10 border border-white/20 backdrop-blur">
                <div className="image mr-8">
                  <img
                    src="/Landing_Imgs/Users(Features).svg"
                    alt="Users Features"
                    className="w-32"
                  />
                </div>
                <div className="text flex-1">
                  <h3 className="bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent text-2xl font-extrabold mb-2">
                    Profile Card
                  </h3>
                  <p className="text-lg font-semibold mb-2">
                    A quick glimpse into the mind behind the screen! Instantly
                    view a user’s full name, username, job title, status, and
                    contact details—all in one sleek hover card. Whether you're
                    searching for experts or just connecting, the right info is
                    always at your fingertips.
                  </p>
                </div>
              </div>
            </div>
            {/* Row 3 */}
            <div className="flex flex-col gap-8 mb-8">
              <div className="features-card-3 glass-effect flex flex-row items-center justify-center px-6 rounded-3xl w-full max-h-[311px] bg-white/10 border border-white/20 backdrop-blur">
                <div className="text flex-1">
                  <h3 className="bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent text-2xl font-extrabold mb-2">
                    Inspiration meets integration
                  </h3>
                  <p className="text-lg font-semibold mb-2">
                    Unlock endless possibilities with our Inspiration Hub, where
                    developer insights and real-world projects fuel creativity.
                    Ready to take it further? Integrate your tools seamlessly,
                    empowering the entire community to enhance their workflows
                    with your innovations
                  </p>
                </div>
                <div className="image ml-8 max-w-56">
                  <img
                    src="/Landing_Imgs/Laptop(Features).png"
                    alt="Laptop Features"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            {/* Row 4 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="features-card-4 glass-effect flex flex-col items-center justify-between p-6 rounded-2xl w-full md:w-1/2 bg-white/10 border border-white/20 backdrop-blur">
                <div className="text">
                  <h3 className="bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent text-2xl font-extrabold mb-2">
                    Inspiration Station
                  </h3>
                  <p className="text-md font-semibold">
                    Need a spark to fuel your next big project? Inspiration
                    Station has you covered. This is where developers,
                    companies, and seasoned pros open up the vault, sharing not
                    only their success stories but also the blueprints behind
                    them. Discover workflows, architectural insights, design
                    strategies, and real-world project structures that have made
                    a difference in their industries. Each entry is packed with
                    lessons learned, creative approaches, and workflow secrets
                    you won’t find anywhere else. Whether you’re tackling a
                    complex network infrastructure, designing a system
                    architecture, or just need a bit of creative fuel to
                    kickstart your ideas, Inspiration Station is here to power
                    you up. Avoid rookie mistakes by learning from the best, get
                    a behind-the-scenes look at projects that have moved the
                    needle, and watch your ideas take shape with guidance from
                    those who’ve been there. With Inspiration Station, your
                    ideas have no boundaries—just possibilities waiting to
                    unfold.
                  </p>
                </div>
                <div className="image p-4 h-[25%] w-full flex items-center justify-center bg-fuchsia-600 rounded-2xl">
                  <img
                    src="/Landing_Imgs/Logo2.svg"
                    alt="Logo2"
                    className="w-44"
                  />
                </div>
              </div>
              <div className="features-card-4 glass-effect flex flex-col p-6 rounded-2xl w-full md:w-1/2 bg-white/10 border border-white/20 backdrop-blur">
                <div className="text flex-1 mb-4">
                  <h3 className="bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent text-2xl font-extrabold mb-2">
                    Tool House Unlocked
                  </h3>
                  <p className="text-lg font-semibold">
                    With Tool House Unlocked, CyMate lets developers, companies,
                    and experts bring their tools to our platform, expanding
                    possibilities for everyone. Developers can upload their
                    tools, provide a quick functionality report, and submit it
                    for approval. Our team checks each tool to make sure it's
                    secure, free from malware, and working as advertised. After
                    approval, the tool stays on the developer's server, with
                    CyMate acting as the bridge for users to discover and use
                    it. Developers decide if their tools are free, have a
                    limited free trial, or are paid. For paid tools, users can
                    make secure transactions right on CyMate, allowing
                    developers to monetize their innovations while contributing
                    to a collaborative, ever-expanding community toolbox.
                  </p>
                </div>
                <div className="tools-container glass-effect-3 flex flex-wrap gap-4 p-4 bg-white/10 border border-white/20 rounded-2xl justify-evenly">
                  <div className="tools-card glass-effect-3 flex gap-2 p-2 rounded-xl bg-white/10 border border-white/20">
                    <img
                      src="/Landing_Imgs/github.svg"
                      alt="GitHub"
                      className="w-8"
                    />
                    <img
                      src="/Landing_Imgs/gitlab.svg"
                      alt="GitLab"
                      className="w-8"
                    />
                  </div>
                  <div className="tools-card glass-effect-3 flex gap-2 p-2 rounded-xl bg-white/10 border border-white/20">
                    <img
                      src="/Landing_Imgs/adobe-creative-cloud.svg"
                      alt="Adobe"
                      className="w-8"
                    />
                    <img
                      src="/Landing_Imgs/figma.svg"
                      alt="Figma"
                      className="w-8"
                    />
                  </div>
                  <div className="tools-card glass-effect-3 flex gap-2 p-2 rounded-xl bg-white/10 border border-white/20">
                    <img
                      src="/Landing_Imgs/google-drive.svg"
                      alt="Google Drive"
                      className="w-8"
                    />
                    <img
                      src="/Landing_Imgs/gmail.svg"
                      alt="Gmail"
                      className="w-8"
                    />
                  </div>
                  <div className="tools-card glass-effect-3 flex gap-2 p-2 rounded-xl bg-white/10 border border-white/20">
                    <img
                      src="/Landing_Imgs/Amazon.svg"
                      alt="Amazon"
                      className="w-8"
                    />
                    <img
                      src="/Landing_Imgs/Reddit.svg"
                      alt="Reddit"
                      className="w-8"
                    />
                  </div>
                  <div className="btn-container w-20 mt-2">
                    <img
                      src="/Landing_Imgs/Plus-Icon.svg"
                      alt="Plus"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <h2 className="text-5xl font-bold text-center text-white">Toolkit</h2>
      <section className="categories py-16" id="categories">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="category-card glass-effect-2 flex flex-col p-6 rounded-2xl w-full md:w-1/2 bg-[#181818] border border-white/20 backdrop-blur">
              <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent">
                Web Vulnerability Examiner
              </h3>
              <p className="mb-4 h-[60%]">
                This tool is like the platform’s security radar, sniffing out
                weaknesses in web apps—from access control issues to
                cryptographic slip-ups. It scans for common vulnerabilities to
                ensure that your web environment stays secure, protecting
                against common threats
              </p>
              <button className="flex items-center gap-2 text-lg font-bold hover:underline transition justify-end">
                Explore{" "}
                <span className="arrow-container">
                  <img
                    src="/Landing_Imgs/Explore Arrow.svg"
                    alt="Explore"
                    className="w-5 h-5"
                  />
                </span>
              </button>
            </div>
            <div className="category-card glass-effect-2 flex flex-col p-6 rounded-2xl w-full md:w-1/2 bg-[#181818] border border-white/20 backdrop-blur">
              <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent">
                Risk & Threat Intelligence
              </h3>
              <p className="mb-4 h-[60%]">
                The Risk & Threat Intelligence is your go-to solution for diving
                deep into security issues without the hassle of endless web
                searches or dealing with fragmented information. Whether it's
                DDoS attack, misconfiguration, or any other critical security
                problem, simply input your issue, and the platform takes over.
              </p>
              <button className="flex items-center gap-2 text-lg font-bold hover:underline transition justify-end">
                Explore{" "}
                <span className="arrow-container">
                  <img
                    src="/Landing_Imgs/Explore Arrow.svg"
                    alt="Explore"
                    className="w-5 h-5"
                  />
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="category-card glass-effect-2 flex flex-col p-6 rounded-2xl w-full md:w-1/2 bg-[#181818] border border-white/20 backdrop-blur">
              <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent">
                Network Scanning & Checking
              </h3>
              <p className="mb-4 h-[60%]">
                This category keeps your network clean and organized, with tools
                to find active hosts, detect open ports, and assess network
                vulnerabilities. It’s like a deep dive into your network’s
                health, ensuring everything’s running smoothly and securely,
                from host to host.
              </p>
              <button className="flex items-center gap-2 text-lg font-bold hover:underline transition justify-end">
                Explore{" "}
                <span className="arrow-container">
                  <img
                    src="/Landing_Imgs/Explore Arrow.svg"
                    alt="Explore"
                    className="w-5 h-5"
                  />
                </span>
              </button>
            </div>
            <div className="category-card glass-effect-2 flex flex-col p-6 rounded-2xl w-full md:w-1/2 bg-[#181818] border border-white/20 backdrop-blur">
              <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#9a46fc] to-[#931774] bg-clip-text text-transparent ">
                Malware Detection
              </h3>
              <p className="mb-4 h-[60%]">
                Whether you're checking for trojans, ransomware, or hidden
                exploits, CyMate gives you the tools to detect, understand, and
                mitigate risks—before they become a problem.
              </p>
              <button className="flex items-center gap-2 text-lg font-bold hover:underline transition justify-end">
                Explore{" "}
                <span className="arrow-container">
                  <img
                    src="/Landing_Imgs/Explore Arrow.svg"
                    alt="Explore"
                    className="w-5 h-5"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spicy Section */}
      {/* <div className="spicy-section py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="text-side max-w-xl flex flex-col gap-8">
              <div className="spicy-functions bg-[#6a6a6a26] text-center rounded-[45px] mb-5 p-8">
                <h4 className="text-2xl font-semibold bg-gradient-to-r from-[#cccccc] to-[#666666] bg-clip-text text-transparent pt-2">The Power Behind Your Tools</h4>
                <h2 className="text-5xl font-extrabold bg-gradient-to-r from-[#9747ff] via-[#9747ff] to-[#cb00a3] bg-clip-text text-transparent">Spicy Functions</h2>
                <p className="text-white text-lg text-left p-4 font-semibold">These built-in functions are the ultimate enablers, transforming CyMate’s Toolkit into a seamless, efficient, and proactive cybersecurity powerhouse. By automating repetitive tasks, integrating tools into one cohesive system, and allowing parallel operations with overlays, the platform maximizes productivity. Monitoring ensures nothing slips through the cracks, while analysis, reporting, and alerting keep you informed and prepared every step of the way. Together, these features form the backbone of a dynamic, user-centric platform that simplifies complex operations and enhances your cybersecurity workflow.</p>
                <div className="keywords mt-4">
                  <div className="first-row flex justify-evenly items-center gap-2">
                    <span className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm">Automation</span>
                    <span className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm">Integration</span>
                    <span className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm">Monitoring</span>
                  </div>
                  <div className="second-row flex justify-evenly items-center gap-2 mt-4">
                    <span className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm">Analysis</span>
                    <span className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm">Reporting</span>
                    <span className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm">Alerting</span>
                  </div>
                </div>
              </div>
              <div className="risk-fuel bg-[#6a6a6a26] text-center rounded-[45px] p-8">
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-[#9747ff] via-[#9747ff] to-[#cb00a3] bg-clip-text text-transparent pt-2">Risk Fuel</h3>
                <h4 className="text-2xl font-semibold bg-gradient-to-r from-[#cccccc] to-[#666666] bg-clip-text text-transparent pt-2">Secure Smarter, Act Faster</h4>
                <p className="text-white text-base text-left p-4 font-semibold">CyMate’s threat hunting and risk tracking system is your vigilant partner in cybersecurity. It goes beyond mere observation, offering proactive detection and continuous monitoring of potential vulnerabilities. Seamlessly integrated with the toolkit, it scans for breaches, unusual activity, and data leaks across open sources, safeguarding critical assets like emails, credit cards, and sensitive information. This feature ensures tools and resources run error-free while identifying and mitigating threats in real time. If a risk or anomaly is detected, it raises immediate alerts, delivers actionable advice, and even recommends trusted organizations or platforms to neutralize the issue. Empowered with real-time insights and guidance, CyMate keeps both individuals and organizations resilient, ensuring your workflow and assets remain secure and efficient.</p>
              </div>
            </div>
            <div className="video-side max-w-xl flex items-center justify-center">
              <img src="/Assests/Images/Video-dump.png" alt="Video" className="rounded-[45px] max-w-[646px]" />
            </div>
          </div>
        </div>
      </div> */}

      {/* How it works, FAQs, Everything you need */}
      <div className="grad-wrap bg-gradient-to-b from-black to-[#9747ff]">
        <div className="how-it-works-section pb-4 relative">
          <div className="container mx-auto px-4">
            <div className="content glass max-w-full relative p-5 overflow-hidden rounded-2xl border border-white/20 shadow-lg">
              <h3 className="text-5xl font-extrabold text-center bg-gradient-to-r from-[#9747ff] via-[#9747ff] to-[#cb00a3] bg-clip-text text-transparent pt-2">
                How it works
              </h3>
              <p className="text-l font-bold text-center text-white py-8 px-12">
                CyMate is more than just a platform; it’s your complete
                ecosystem for cybersecurity and software development. At its
                core lies the Toolkit, a powerhouse of features like automation,
                integration, and risk tracking. These built-in functions work
                seamlessly with tools for web vulnerability scanning, malware
                detection, network analysis, and more—helping users execute
                complex tasks with efficiency and precision. But CyMate isn’t
                only about tools; it’s about collaboration. Through the
                Community Feed, developers and cybersecurity enthusiasts can
                engage in discussions, share blogs, answer questions, and tackle
                real-world challenges. The integrated Effort Score system
                rewards active participation, making engagement a rewarding
                experience both professionally and socially. CyMate also
                inspires innovation through its Innovation Space, where users
                can discover resources, explore best practices, and integrate
                new tools directly into their workflows. This fosters a culture
                of creativity and growth, where ideas turn into impactful
                solutions. What sets CyMate apart is its focus on empowering
                developers financially. From Task-Based Earnings, where users
                solve cybersecurity challenges for rewards, to Tool Integration,
                which lets developers monetize their creations, the platform
                transforms expertise into tangible income. Whether you’re
                contributing to the community or showcasing your skills through
                a personalized portfolio, CyMate ensures your work gets the
                recognition—and compensation—it deserves. With its robust risk
                and threat tracking system, CyMate doesn’t just keep your tools
                running smoothly—it actively protects them. Real-time
                monitoring, actionable insights, and recommendations for trusted
                solutions make it a trusted ally in securing your assets and
                workflows. CyMate redefines collaboration, security, and
                innovation, providing an all-in-one hub where developers can
                thrive, organizations can excel, and cybersecurity becomes a
                collective mission.
              </p>
              <div className="how-it-works-img flex justify-center items-center">
                <img
                  src="/Landing_Imgs/how-it-works.png"
                  alt="How it works"
                  className="w-[500px] max-w-2xl rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="faqs-section pt-8 pb-8 text-center">
          <div className="container mx-auto px-4">
            <div className="content">
              <h5 className="text-white font-semibold text-2xl pt-8">FAQs</h5>
              <h2 className="text-5xl font-semibold text-white pb-4">
                We've got the answers
              </h2>
              <Accordion
                type="single"
                collapsible
                className="mt-8 space-y-4 w-full"
              >
                <AccordionItem
                  value="what-is-cymate"
                  className="accordion-item glass rounded-2xl p-4"
                >
                  <AccordionTrigger className="text-xl font-bold hover:no-underline">
                    How can I start using CyMate’s Toolkit for cybersecurity
                    tasks?
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 text-white text-base text-left">
                    Getting started with CyMate’s Toolkit is simple! Once you’ve
                    signed up, navigate to the Toolkit section where you’ll find
                    features like Web Vulnerability Scanner, Network Scanning,
                    Malware Detection, and Risk & Threat Intelligence . Just
                    select the tool you want to use, provide the required input
                    (like a website URL or a file), and let CyMate’s automation
                    handle the rest. The results will be processed and delivered
                    directly to you.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="how-to-earn"
                  className="accordion-item glass rounded-2xl p-4"
                >
                  <AccordionTrigger className="text-xl font-bold hover:no-underline">
                    How can I collaborate with other developers or cybersecurity
                    experts on CyMate?
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 text-white text-base text-left">
                    CyMate’s Community Feed is your hub for collaboration. You
                    can share posts, ask questions, write blogs, or even respond
                    to tasks published by other users.Engaging with the
                    community not only helps you grow but also boosts your
                    Effort Score making your contributions visible and valuable.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="is-secure"
                  className="accordion-item glass rounded-2xl p-4"
                >
                  <AccordionTrigger className="text-xl font-bold hover:no-underline">
                    What development resources are available in CyMate’s
                    Inspiration?
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 text-white text-base text-left">
                    CyMate offers curated templates, real-world simulations, and
                    practical examples to help developers and engineers apply
                    cybersecurity concepts, accelerate learning, and build
                    innovative solutions efficiently.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <div className="everything-u-need-section pt-8 pb-8 text-center">
          <div className="container mx-auto px-4">
            <div className="content">
              <h2 className="text-white text-4xl font-extrabold">
                Everything you need, all in one place power up your journey!
              </h2>
              <div className="everything-img flex justify-center items-center py-8">
                <img
                  src="/Landing_Imgs/inspiration.png"
                  alt="Everything you need"
                  className="w-full max-w-2xl rounded-3xl"
                />
              </div>
              <div className="lanuch flex items-center justify-evenly pb-8">
                <h3 className="text-white text-3xl font-extrabold">
                  Develop with your favourite tools
                </h3>
                <Link href="/login" passHref legacyBehavior>
                  <a className="text-black text-xl font-semibold bg-white rounded-full px-10 py-3 shadow-lg hover:bg-gray-200 transition flex items-center">
                    Launch the Adventure{" "}
                    <i className="fa-regular fa-circle-right ml-2" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-section bg-black px-8 py-4 flex justify-between items-center">
        <div className="cymate-logo w-36">
          <img src="/Logo.svg" alt="CyMate Logo" className="max-w-full" />
        </div>
        <div className="links">
          <ul className="flex text-white list-none m-0 p-0 space-x-8 text-lg font-semibold cursor-pointer">
            <li>Contact</li>
            <li>Resources</li>
            <li>About</li>
            <li>Services</li>
            <li>Social Media</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
