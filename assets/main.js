// ToolroomOS site: scroll reveals, the sticky "one job" story, nav behaviour. No dependencies.
(() => {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]

  // Reveal sections as they scroll in
  const reveal = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target) }
  }, { threshold: 0.15, rootMargin: "0px 0px -40px" })
  $$(".reveal, .floor__art").forEach(el => reveal.observe(el))

  // Flow: the step nearest the middle of the screen drives the sticky stage
  const stage = $(".stage")
  const steps = $$(".step")
  if (stage && steps.length) {
    const setStep = i => {
      stage.dataset.step = String(i)
      stage.style.setProperty("--p", String(i))
      steps.forEach((s, k) => s.classList.toggle("active", k === i))
    }
    setStep(0)
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setStep(Number(e.target.dataset.step))
    // phones: the card sits on top, so watch the band below it
    }, { rootMargin: matchMedia("(max-width: 980px)").matches ? "-72% 0px -26% 0px" : "-45% 0px -45% 0px" })
    steps.forEach(s => io.observe(s))
  }

  // Nav: solid on scroll, mobile menu
  const nav = $("#nav")
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8)
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })

  const burger = $("#burger"), links = $("#navLinks")
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open")
    burger.setAttribute("aria-expanded", String(open))
  })
  links.addEventListener("click", e => {
    if (e.target.closest("a")) { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false") }
  })

  // Hero status card: one example job walking through every station (made-up names)
  const tag = $("#heroTag")
  const stages = [
    ["Enquiry · ENQ-1042", "41 parts read from assembly.step"],
    ["Design · CP-101 Core plate", "Stock size 460 × 350 × 65 · EN31"],
    ["Purchase · PO-2207", "Apex Steels · 4 of 4 lines received"],
    ["Production · GP-204 Guide pin", "Turning on CNC Lathe 1 · 14 queued"],
    ["Dispatch · DC/26-27/0004", "Out to Nova Heat Treat · vehicle TS09AB1234"],
  ]
  if (tag && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let k = 0
    setInterval(() => {
      k = (k + 1) % stages.length
      tag.classList.add("swap")
      setTimeout(() => {
        tag.innerHTML = `<b>${stages[k][0]}</b><small>${stages[k][1]}</small>`
        tag.classList.remove("swap")
      }, 250)
    }, 3000)
  }

  // Solutions tabs: click or arrow keys, one panel visible
  const tabs = $("[data-tabs]")
  if (tabs) {
    const btns = $$("[role=tab]", tabs)
    const select = b => btns.forEach(x => {
      const on = x === b
      x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1
      $("#" + x.getAttribute("aria-controls")).hidden = !on
    })
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(b))
      b.addEventListener("keydown", e => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
        if (!d) return
        const n = btns[(i + d + btns.length) % btns.length]; select(n); n.focus()
      })
    })
  }

  // Demo form: opens a WhatsApp chat with the details typed in, the visitor just presses send
  const form = $("#demoForm")
  if (form) form.addEventListener("submit", e => {
    e.preventDefault()
    const note = $("#demoNote")
    let ok = true
    for (const el of form.querySelectorAll("[required]")) {
      const bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value))
      el.setAttribute("aria-invalid", String(bad)); if (bad && ok) { el.focus(); ok = false }
    }
    if (!ok) { note.textContent = "Please fill in your name, work email and company."; return }
    const v = Object.fromEntries(new FormData(form))
    const text = [
      "Hi, I would like a ToolroomOS demo.", "",
      `Name: ${v.name}`, `Company: ${v.company}`, `Email: ${v.email}`, `Shop type: ${v.type}`,
      ...(v.msg ? ["", v.msg] : []),
    ].join("\n")
    const url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`
    const win = window.open(url, "_blank") // "noopener" would make this return null
    if (win) win.opener = null
    note.innerHTML = win ? "WhatsApp is opening. Press send to reach us." : `<a class="link" href="${url}" target="_blank" rel="noopener">Open WhatsApp</a> to send your request.`
  })

  // Sign in is a placeholder until the customer portal address is final
  const toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); document.body.append(toast)
  $$("[data-signin]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault()
    toast.textContent = "Customer sign-in is opening soon. Book a demo to get access."
    toast.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => toast.classList.remove("show"), 3200)
  }))

  const y = $("#year")
  if (y) y.textContent = String(new Date().getFullYear())
})()
