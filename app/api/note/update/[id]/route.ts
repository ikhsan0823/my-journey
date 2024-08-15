import { NextRequest, NextResponse } from 'next/server'
import connect from '@/lib/db'
import Note from '@/lib/models/note'
import getUserData from '@/lib/getUserData'

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params
    const { title, content, category, date } = await request.json()

    try {
        await connect()
        const userData = await getUserData(request)

        if (!userData) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const lowerCaseCategory = category.toLowerCase()

        const note = await Note.findByIdAndUpdate(id, {
            title,
            content,
            category: lowerCaseCategory,
            date: new Date(date)
        }, { new: true })

        return NextResponse.json({ note, message: 'Note updated successfully' }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 })
    }
}

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params
    try {
        await connect()
        const userData = await getUserData(request)

        if (!userData) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const note = await Note.findByIdAndDelete(id)

        return NextResponse.json({ note, message: 'Note deleted successfully' }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 })
    }
}
