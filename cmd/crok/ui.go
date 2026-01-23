package main

import (
	"fmt"
	"time"

	"github.com/charmbracelet/bubbles/table"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

var (
	accentColor = lipgloss.Color("#10b981")
	grayColor   = lipgloss.Color("#94a3b8")
	whiteColor  = lipgloss.Color("#ffffff")

	headerStyle = lipgloss.NewStyle().
			Foreground(whiteColor).
			Background(accentColor).
			Padding(0, 1).
			Bold(true)

	statusStyle = lipgloss.NewStyle().
			Foreground(accentColor).
			Bold(true)
)

type model struct {
	table    table.Model
	proxy    *ProxyServer
	engine   *EngineClient
	logs     []LogEntry
	status   string
	agentID  string
	width    int
	height   int
	lastLog  LogEntry
}

func initialModel(p *ProxyServer, e *EngineClient, agentID string) model {
	columns := []table.Column{
		{Title: "TIME", Width: 10},
		{Title: "METHOD", Width: 8},
		{Title: "URL", Width: 40},
		{Title: "STATUS", Width: 10},
		{Title: "SETTLED", Width: 10},
	}

	t := table.New(
		table.WithColumns(columns),
		table.WithFocused(true),
		table.WithHeight(10),
	)

	s := table.DefaultStyles()
	s.Header = s.Header.
		BorderStyle(lipgloss.NormalBorder()).
		BorderForeground(lipgloss.Color("240")),
		Bold(false)
	
	// Fix: Apply styles via table.WithStyles or set individual style fields correctly
	t.SetStyles(s)

	return model{
		table:   t,
		proxy:   p,
		engine:  e,
		status:  "CONNECTING...",
		agentID: agentID,
	}
}

func (m model) Init() tea.Cmd {
	return tea.Batch(
		tea.Tick(time.Second, func(t time.Time) tea.Msg { return tickMsg(t) }),
		listenForLogs(m.proxy.Log),
	)
}

type tickMsg time.Time
type logMsg LogEntry

func listenForLogs(sub chan LogEntry) tea.Cmd {
	return func() tea.Msg {
		val, ok := <-sub
		if !ok {
			return nil
		}
		return logMsg(val)
	}
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			return m, tea.Quit
		}
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
	case tickMsg:
		m.status = "SECURE_TUNNEL_ACTIVE"
		return m, tea.Tick(time.Second, func(t time.Time) tea.Msg { return tickMsg(t) })
	case logMsg:
		m.logs = append(m.logs, LogEntry(msg))
		if len(m.logs) > 50 {
			m.logs = m.logs[1:]
		}
		m.lastLog = LogEntry(msg)
		
		var rows []table.Row
		for i := len(m.logs) - 1; i >= 0; i-- {
			l := m.logs[i]
			paid := "-"
			if l.Paid {
				paid = "0.01 USDC"
			}
		ows = append(rows, table.Row{
				l.Timestamp.Format("15:04:05"),
				l.Method,
				l.URL,
				fmt.Sprintf("%d", l.Status),
				paid,
			})
		}
		m.table.SetRows(rows)
		return m, listenForLogs(m.proxy.Log)
	}

	m.table, cmd = m.table.Update(msg)
	return m, cmd
}

func (m model) View() string {
	if m.width == 0 || m.height == 0 {
		return "Initializing UI..."
	}

	sidebarWidth := 30
	mainWidth := m.width - sidebarWidth - 6

	// Sidebar
	sidebar := lipgloss.NewStyle().
		Width(sidebarWidth).
		Height(m.height - 4).
		Padding(1).
		BorderStyle(lipgloss.RoundedBorder()).
		BorderForeground(accentColor).
		Render(
			lipgloss.JoinVertical(lipgloss.Left,
				headerStyle.Render("🐊 CROKODILE CLI"),
				"\n",
				lipgloss.NewStyle().Foreground(grayColor).Render("NODE_STATUS:"),
				statusStyle.Render(m.status),
				"\n",
				lipgloss.NewStyle().Foreground(grayColor).Render("AGENT_ID:"),
				lipgloss.NewStyle().Bold(true).Render(m.agentID),
				"\n",
				lipgloss.NewStyle().Foreground(grayColor).Render("ENGINE_UPSTREAM:"),
				lipgloss.NewStyle().Render(m.engine.Endpoint),
				"\n",
				lipgloss.NewStyle().Foreground(grayColor).Render("PROXY_PORT:"),
				lipgloss.NewStyle().Render(m.proxy.Port),
				"\n\n",
				lipgloss.NewStyle().Foreground(grayColor).Render("LAST_INTERCEPT:"),
				lipgloss.NewStyle().Faint(true).Render(m.lastLog.URL),
				"\n\n",
				lipgloss.NewStyle().Foreground(grayColor).Render("CONTROLS:"),
				lipgloss.NewStyle().Faint(true).Render("q: Quit\n↑/↓: Scroll Logs"),
			),
		)

	// Main Content
	logTable := lipgloss.NewStyle().
		BorderStyle(lipgloss.RoundedBorder()).
		BorderForeground(accentColor).
		Width(mainWidth).
		Render(
			lipgloss.JoinVertical(lipgloss.Left,
				headerStyle.Render("LIVE INTERCEPTION TRAFFIC"),
				m.table.View(),
			),
		)

	footer := lipgloss.NewStyle().
		Width(m.width - 2).
		Align(lipgloss.Center).
		Foreground(lipgloss.Color("#475569")),
		Render("© 2026 CROKODILE SECURE PROTOCOL • cronos-x402-v2.0.4-pro")

	return lipgloss.JoinVertical(lipgloss.Left,
		lipgloss.JoinHorizontal(lipgloss.Top, sidebar, logTable),
		footer,
	)
}
