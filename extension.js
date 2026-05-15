({
    name: "V7RC",
    description: "V7RC IO Command Protocol receiver for MicroPython UART",
    author: "INEX / microBlock",
    category: "Communication",
    version: "1.0.0",
    icon: "/static/icon.png",
    color: "#CF131C",
    blocks: [
        {
            xml: `<label text="General"></label>`
        },
        {
            xml: `
                <block type="v7rc_begin">
                    <value name="UART_ID">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                    </value>
                    <value name="RX">
                        <shadow type="math_number">
                            <field name="NUM">5</field>
                        </shadow>
                    </value>
                    <value name="BAUD">
                        <shadow type="math_number">
                            <field name="NUM">115200</field>
                        </shadow>
                    </value>
                </block>
            `
        },
        {
            xml: `<block type="v7rc_update"></block>`
        },
        {
            xml: `<block type="v7rc_channel_pwm"></block>`
        },
        {
            xml: `<block type="v7rc_channel_percent"></block>`
        },
        {
            xml: `<block type="v7rc_channel_signed_percent"></block>`
        },
        {
            xml: `<block type="v7rc_lost_signal"></block>`
        },
        {
            xml: `<label text="Debug / Protocol"></label>`
        },
        {
            xml: `<block type="v7rc_command_data"></block>`
        },
        {
            xml: `<block type="v7rc_raw_data"></block>`
        },
        {
            xml: `<block type="v7rc_cmd_text"></block>`
        },
        {
            xml: `<block type="v7rc_channel_raw"></block>`
        },
        {
            xml: `<block type="v7rc_channel_degree"></block>`
        },
        {
            xml: `<block type="v7rc_payload_byte"></block>`
        }
    ]
});
