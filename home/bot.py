
import discord # type: ignore
import asyncio
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()

TOKEN =os.getenv("DISCORD_BOT_TOKEN")                          
CHANNEL_ID = os.getenv("DISCORD_CHANNEL_ID")

intents = discord.Intents.default()
client = discord.Client(intents=intents)

# Create a global queue to pass messages from Django to Discord
message_queue = asyncio.Queue()

async def send_message_to_channel(msg: str):
    """Put message into queue to be sent by the bot loop."""
    await message_queue.put(msg)

@client.event
async def on_ready():
    print(f"✅ Logged in as {client.user}")
    # Start background task to process queued messages
    client.loop.create_task(message_sender())

async def message_sender():
    """Background task to pull messages from queue and send to Discord."""
    channel = client.get_channel(CHANNEL_ID)
    while True:
        msg = await message_queue.get()
        if channel:
            await channel.send(msg)

async def main():
    async with client:
        await client.start(TOKEN)

if __name__ == "__main__":
    asyncio.run(main())
