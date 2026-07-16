<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Byte's Debug Lab — Workbook 1</title>
<link rel="stylesheet" href="style.css"/>
</head>
<body>

<button class="print-btn" onclick="window.print()">Print / Save PDF</button>


<!-- ════════════════════════════════════════
     PAGE 1 · COVER
════════════════════════════════════════ -->
<div class="page">
<div class="cover">

  <div class="c-top">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="c-logo"/>
    <span class="c-wb">Workbook 1</span>
  </div>

  <div class="c-mid">
    <span class="c-eye">Method &amp; Motion · STEM Series</span>
    <div class="c-title">Byte's<br/><em>Debug</em><br/>Lab.</div>
    <p class="c-desc">
      A beginner's guide to finding and fixing mistakes — the way real coders do it.
    </p>
    <div class="c-fields">
      <div><div class="c-fl">Name</div><div class="c-fl-line"></div></div>
      <div><div class="c-fl">Grade</div><div class="c-fl-line"></div></div>
      <div><div class="c-fl">Date</div><div class="c-fl-line"></div></div>
    </div>
  </div>

  <img src="assets/byte.png" alt="Byte" class="c-byte"/>

  <div class="c-bot">
    <span class="c-note">methodandmotion.com</span>
    <span class="c-note">Debugging · Sequencing · Problem Solving</span>
  </div>

</div>
</div>


<!-- ════════════════════════════════════════
     PAGE 2 · WHAT IS DEBUGGING?
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-num">Introduction</span>
    </div>
  </div>

  <div class="t-title">What is debugging?</div>
  <div class="t-sub">A bug is any mistake in a set of instructions. Debugging means finding it — and fixing it.</div>

  <div class="byte-bar">
    <img src="assets/byte.png" alt="Byte"/>
    <p>Hi, I'm Byte. Every mistake is just a clue. I'll show you how to find them.</p>
  </div>

  <div class="t-label" style="margin-bottom:14px">See the difference</div>

  <div class="two" style="margin-bottom:34px">
    <div>
      <div style="font-family:var(--m);font-size:9px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:10px">BROKEN</div>
      <div class="steps" style="margin:0">
        <div class="step"><div class="sn">1</div>Get a bowl</div>
        <div class="step bug"><div class="sn">2</div>Eat the cereal</div>
        <div class="step"><div class="sn">3</div>Pour in cereal</div>
        <div class="step"><div class="sn">4</div>Add milk</div>
      </div>
    </div>
    <div>
      <div style="font-family:var(--m);font-size:9px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:10px">FIXED</div>
      <div class="steps" style="margin:0">
        <div class="step"><div class="sn">1</div>Get a bowl</div>
        <div class="step"><div class="sn">2</div>Pour in cereal</div>
        <div class="step"><div class="sn">3</div>Add milk</div>
        <div class="step"><div class="sn">4</div>Eat the cereal</div>
      </div>
    </div>
  </div>

  <p class="t-body">Step 2 was in the wrong place. That's all a bug is. Now let's find some.</p>

  <div class="pf">
    <span class="pf-note">methodandmotion.com</span>
    <span class="pf-note">Byte's Debug Lab · Workbook 1</span>
  </div>
</div>


<!-- ════════════════════════════════════════
     PAGE 3 · ACTIVITY 1 — PUT IT IN ORDER
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-act">Activity 1 of 5</span>
    </div>
  </div>

  <div class="t-title">Put it in order.</div>
  <div class="t-sub">Write a number — 1 through 6 — in each box to show the correct sequence.</div>

  <div class="sgrid">
    <div class="si"><div class="sq"></div>Walk out the door</div>
    <div class="si"><div class="sq"></div>Wake up</div>
    <div class="si"><div class="sq"></div>Eat breakfast</div>
    <div class="si"><div class="sq"></div>Get dressed</div>
    <div class="si"><div class="sq"></div>Pack your bag</div>
    <div class="si"><div class="sq"></div>Brush your teeth</div>
  </div>

  <div class="hr"></div>

  <div class="t-label">Your thinking</div>
  <p style="font-size:13px;font-weight:500;color:var(--ink);margin-bottom:18px">Which step had to come first, and why?</p>
  <div class="lines">
    <div class="l"></div><div class="l"></div>
    <div class="l"></div><div class="l"></div>
    <div class="l"></div>
  </div>

  <div class="pf">
    <span class="pf-note">Sequencing</span>
    <span class="pf-note">methodandmotion.com</span>
  </div>
</div>


<!-- ════════════════════════════════════════
     PAGE 4 · ACTIVITY 2 — FIND THE BUG
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-act">Activity 2 of 5</span>
    </div>
  </div>

  <div class="t-title">Find the bug.</div>
  <div class="t-sub">One step in each list is in the wrong place. Circle it.</div>

  <div class="two" style="margin-bottom:32px">
    <div>
      <div style="font-family:var(--m);font-size:9px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:11px">MAKING A SANDWICH</div>
      <div class="steps" style="margin:0">
        <div class="step"><div class="sn">1</div>Get two slices of bread</div>
        <div class="step"><div class="sn">2</div>Open the peanut butter</div>
        <div class="step"><div class="sn">3</div>Put the lid back on</div>
        <div class="step"><div class="sn">4</div>Spread peanut butter</div>
        <div class="step"><div class="sn">5</div>Press slices together</div>
      </div>
    </div>
    <div>
      <div style="font-family:var(--m);font-size:9px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:11px">SENDING A MESSAGE</div>
      <div class="steps" style="margin:0">
        <div class="step"><div class="sn">1</div>Open the app</div>
        <div class="step"><div class="sn">2</div>Press send</div>
        <div class="step"><div class="sn">3</div>Tap new message</div>
        <div class="step"><div class="sn">4</div>Type your friend's name</div>
        <div class="step"><div class="sn">5</div>Write your message</div>
      </div>
    </div>
  </div>

  <div class="hr"></div>

  <div class="t-label">Write the fix</div>
  <div class="two">
    <div>
      <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.08em;margin-bottom:9px">SANDWICH — step _____ should say:</div>
      <div class="box bmd"></div>
    </div>
    <div>
      <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.08em;margin-bottom:9px">MESSAGE — step _____ should say:</div>
      <div class="box bmd"></div>
    </div>
  </div>

  <div class="pf">
    <span class="pf-note">Find the Bug</span>
    <span class="pf-note">methodandmotion.com</span>
  </div>
</div>


<!-- ════════════════════════════════════════
     PAGE 5 · ACTIVITY 3 — FIX THE CODE
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-act">Activity 3 of 5</span>
    </div>
  </div>

  <div class="t-title">Fix the code.</div>
  <div class="t-sub">The highlighted line is broken. Cross it out. Write the correct version below.</div>

  <div style="margin-bottom:30px">
    <div style="font-family:var(--m);font-size:9px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:11px">PROGRAM 1 — ROBOT DELIVERY</div>
    <div class="code">
      START<br/>
      MOVE forward 3 steps<br/>
      TURN right<br/>
      MOVE forward 2 steps<br/>
      <span class="bug-line">JUMP backward 7 steps</span><br/>
      PICK UP package<br/>
      DELIVER to door<br/>
      END
    </div>
    <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.08em;margin-bottom:9px">THE CORRECT LINE IS:</div>
    <div class="box bsm"></div>
  </div>

  <div class="hr"></div>

  <div>
    <div style="font-family:var(--m);font-size:9px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:11px">PROGRAM 2 — WATER THE PLANTS</div>
    <div class="code">
      START<br/>
      FILL watering can<br/>
      <span class="bug-line">PUT DOWN watering can</span><br/>
      WALK to first plant<br/>
      POUR water on plant<br/>
      WALK to second plant<br/>
      POUR water on plant<br/>
      END
    </div>
    <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.08em;margin-bottom:9px">THE CORRECT LINE IS:</div>
    <div class="box bsm"></div>
  </div>

  <div class="pf">
    <span class="pf-note">Fix the Code</span>
    <span class="pf-note">methodandmotion.com</span>
  </div>
</div>


<!-- ════════════════════════════════════════
     PAGE 6 · ACTIVITY 4 — TRACE THE PATH
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-act">Activity 4 of 5</span>
    </div>
  </div>

  <div class="t-title">Trace the path.</div>
  <div class="t-sub">Follow the arrows. One is pointing the wrong way — find it and circle it.</div>

  <div style="font-family:var(--m);font-size:9px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:13px">HELP BYTE REACH THE BACKPACK</div>

  <div class="agrid g6" style="margin-bottom:36px">
    <div class="ac s">START</div>
    <div class="ac">→</div>
    <div class="ac">→</div>
    <div class="ac">→</div>
    <div class="ac">→</div>
    <div class="ac">↓</div>

    <div class="ac empty"></div>
    <div class="ac empty"></div>
    <div class="ac">←</div>
    <div class="ac">↓</div>
    <div class="ac">↓</div>
    <div class="ac">↓</div>

    <div class="ac">↑</div>
    <div class="ac">↑</div>
    <div class="ac">←</div>
    <div class="ac">←</div>
    <div class="ac">←</div>
    <div class="ac">↓</div>

    <div class="ac">↑</div>
    <div class="ac">→</div>
    <div class="ac">→</div>
    <div class="ac">→</div>
    <div class="ac">→</div>
    <div class="ac e">🎒</div>
  </div>

  <div class="hr"></div>

  <div class="two">
    <div>
      <div class="t-label">The broken arrow is at:</div>
      <div style="font-size:13.5px;font-weight:500;color:var(--ink);line-height:2.4">
        Row &nbsp;<span style="display:inline-block;width:44px;border-bottom:1.5px solid var(--rule);vertical-align:bottom"></span>
        &nbsp; Column &nbsp;<span style="display:inline-block;width:44px;border-bottom:1.5px solid var(--rule);vertical-align:bottom"></span>
      </div>
      <div style="font-size:13.5px;font-weight:500;color:var(--ink);line-height:2.4;margin-top:4px">
        Points &nbsp;<span style="display:inline-block;width:38px;border-bottom:1.5px solid var(--rule);vertical-align:bottom"></span>
        &nbsp; should be &nbsp;<span style="display:inline-block;width:38px;border-bottom:1.5px solid var(--rule);vertical-align:bottom"></span>
      </div>
    </div>
    <div>
      <div class="t-label">How did you find it?</div>
      <div class="lines">
        <div class="l"></div><div class="l"></div>
        <div class="l"></div><div class="l"></div>
      </div>
    </div>
  </div>

  <div class="pf">
    <span class="pf-note">Trace the Path</span>
    <span class="pf-note">methodandmotion.com</span>
  </div>
</div>


<!-- ════════════════════════════════════════
     PAGE 7 · ACTIVITY 5 — TRUE OR FALSE
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-act">Activity 5 of 5</span>
    </div>
  </div>

  <div class="t-title">True or false?</div>
  <div class="t-sub">Circle your answer. If it's false, write the correction on the line below.</div>

  <div style="display:flex;flex-direction:column;gap:0;margin-bottom:0">

    <div style="padding:20px 0;border-bottom:1px solid var(--rule)">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:14px;font-weight:500;color:var(--ink);max-width:66%">A program always starts from the last step.</span>
        <span style="font-size:13px;font-weight:600;color:var(--ink-3);letter-spacing:.04em">True &nbsp;&nbsp;&nbsp; False</span>
      </div>
      <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:5px">IF FALSE, WRITE THE CORRECTION:</div>
      <div style="height:28px;border-bottom:1px solid var(--rule)"></div>
    </div>

    <div style="padding:20px 0;border-bottom:1px solid var(--rule)">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:14px;font-weight:500;color:var(--ink);max-width:66%">Skipping a step has no effect on the result.</span>
        <span style="font-size:13px;font-weight:600;color:var(--ink-3);letter-spacing:.04em">True &nbsp;&nbsp;&nbsp; False</span>
      </div>
      <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:5px">IF FALSE, WRITE THE CORRECTION:</div>
      <div style="height:28px;border-bottom:1px solid var(--rule)"></div>
    </div>

    <div style="padding:20px 0;border-bottom:1px solid var(--rule)">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:14px;font-weight:500;color:var(--ink);max-width:66%">An algorithm is a set of steps that solves a problem.</span>
        <span style="font-size:13px;font-weight:600;color:var(--ink-3);letter-spacing:.04em">True &nbsp;&nbsp;&nbsp; False</span>
      </div>
      <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:5px">IF FALSE, WRITE THE CORRECTION:</div>
      <div style="height:28px;border-bottom:1px solid var(--rule)"></div>
    </div>

    <div style="padding:20px 0;border-bottom:1px solid var(--rule)">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:14px;font-weight:500;color:var(--ink);max-width:66%">Debugging means deleting everything and starting over.</span>
        <span style="font-size:13px;font-weight:600;color:var(--ink-3);letter-spacing:.04em">True &nbsp;&nbsp;&nbsp; False</span>
      </div>
      <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:5px">IF FALSE, WRITE THE CORRECTION:</div>
      <div style="height:28px;border-bottom:1px solid var(--rule)"></div>
    </div>

    <div style="padding:20px 0">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:14px;font-weight:500;color:var(--ink);max-width:66%">Every coder — beginner or expert — debugs their work.</span>
        <span style="font-size:13px;font-weight:600;color:var(--ink-3);letter-spacing:.04em">True &nbsp;&nbsp;&nbsp; False</span>
      </div>
      <div style="font-family:var(--m);font-size:8.5px;color:var(--ink-3);letter-spacing:.1em;margin-bottom:5px">IF FALSE, WRITE THE CORRECTION:</div>
      <div style="height:28px;border-bottom:1px solid var(--rule)"></div>
    </div>

  </div>

  <div class="pf">
    <span class="pf-note">Spot What's Wrong</span>
    <span class="pf-note">methodandmotion.com</span>
  </div>
</div>


<!-- ════════════════════════════════════════
     PAGE 8 · REFLECTION
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-num">Reflection</span>
    </div>
  </div>

  <div class="t-title">Look back.</div>
  <div class="t-sub">No wrong answers. Just your honest thinking.</div>

  <div style="display:flex;flex-direction:column;gap:28px;margin-bottom:38px">

    <div>
      <div class="t-label">What does debugging mean to you now?</div>
      <div class="lines">
        <div class="l"></div><div class="l"></div>
        <div class="l"></div><div class="l"></div>
      </div>
    </div>

    <div>
      <div class="t-label">Which activity was hardest, and why?</div>
      <div class="lines">
        <div class="l"></div><div class="l"></div>
        <div class="l"></div><div class="l"></div>
      </div>
    </div>

    <div class="two" style="gap:24px">
      <div>
        <div class="t-label">A bug I noticed in real life:</div>
        <div class="lines">
          <div class="l"></div><div class="l"></div><div class="l"></div>
        </div>
      </div>
      <div>
        <div class="t-label">How I would fix it:</div>
        <div class="lines">
          <div class="l"></div><div class="l"></div><div class="l"></div>
        </div>
      </div>
    </div>

  </div>

  <div class="byte-bar" style="margin-bottom:0">
    <img src="assets/byte.png" alt="Byte"/>
    <p>You finished. Every bug you found was a clue — and every clue made you sharper. That's what coders do.</p>
  </div>

  <div class="pf">
    <span class="pf-note">methodandmotion.com</span>
    <span class="pf-note">Byte's Debug Lab · Workbook 1</span>
  </div>
</div>


<!-- ════════════════════════════════════════
     PAGE 9 · ANSWER KEY
════════════════════════════════════════ -->
<div class="page">
  <div class="ph">
    <img src="assets/logo.png" alt="Method &amp; Motion" class="ph-logo"/>
    <div class="ph-right">
      <span class="pg-num">Answer Key</span>
    </div>
  </div>

  <div class="t-title" style="font-size:24px;margin-bottom:6px">Answer Key</div>
  <div class="t-sub" style="margin-bottom:30px">For open reflection questions, accept any thoughtful response. These are not graded.</div>

  <div class="ak"><span class="ak-k">Activity 1</span><span class="ak-v">Correct order: 1 Wake up · 2 Brush teeth · 3 Get dressed · 4 Eat breakfast · 5 Pack bag · 6 Walk out the door</span></div>
  <div class="ak"><span class="ak-k">Activity 2A</span><span class="ak-v">Bug is Step 3 — "Put the lid back on" happens before the peanut butter is spread. It belongs after Step 4.</span></div>
  <div class="ak"><span class="ak-k">Activity 2B</span><span class="ak-v">Bug is Step 2 — "Press send" happens before the message is written. It should be the last step.</span></div>
  <div class="ak"><span class="ak-k">Activity 3A</span><span class="ak-v">"JUMP backward 7 steps" is the bug. The robot needs to continue forward. Correct: MOVE forward 2 steps.</span></div>
  <div class="ak"><span class="ak-k">Activity 3B</span><span class="ak-v">"PUT DOWN watering can" is the bug. It should be removed, or moved to the very end after watering is complete.</span></div>
  <div class="ak"><span class="ak-k">Activity 4</span><span class="ak-v">Broken arrow: Row 2, Column 3. Points ← (left) — should point ↓ (down) to continue the correct path to the backpack.</span></div>
  <div class="ak"><span class="ak-k">Activity 5</span><span class="ak-v">1 — False &nbsp;·&nbsp; 2 — False &nbsp;·&nbsp; 3 — True &nbsp;·&nbsp; 4 — False &nbsp;·&nbsp; 5 — True</span></div>

  <div class="pf">
    <span class="pf-note">Not for student distribution</span>
    <span class="pf-note">methodandmotion.com · Byte's Debug Lab</span>
  </div>
</div>


</body>
</html>
