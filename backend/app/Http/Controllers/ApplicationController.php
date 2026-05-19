<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    // Admin: List all applications
    public function index(Request $request)
    {
        $query = JobApplication::with(['jobPosting', 'reviewer'])
            ->orderBy('created_at', 'desc');

        // Filter by job posting
        if ($request->has('job_posting_id')) {
            $query->where('job_posting_id', $request->job_posting_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    // Admin: Show single application with media (resume)
    public function show($id)
    {
        $application = JobApplication::with(['jobPosting', 'reviewer'])->findOrFail($id);
        
        // Append media urls
        $resumeUrl = $application->getFirstMediaUrl('resume');
        $application->resume_url = $resumeUrl ? asset($resumeUrl) : null;

        return response()->json($application);
    }

    // Public: Apply for a job posting
    public function store(Request $request, $jobId)
    {
        $job = JobPosting::findOrFail($jobId);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'linkedin_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'cover_letter' => 'nullable|string',
            'answers' => 'nullable|array',
            'referred_by' => 'nullable|string|max:255',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:10240', // Max 10MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $application = JobApplication::create([
            'job_posting_id' => $job->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'linkedin_url' => $request->linkedin_url,
            'portfolio_url' => $request->portfolio_url,
            'cover_letter' => $request->cover_letter,
            'answers' => $request->answers,
            'referred_by' => $request->referred_by,
            'ip_address' => $request->ip(),
            'status' => 'new',
        ]);

        // Attach resume via Spatie MediaLibrary
        if ($request->hasFile('resume')) {
            $application->addMediaFromRequest('resume')
                ->toMediaCollection('resume');
        }

        // Log public job application event
        activity()
            ->performedOn($application)
            ->withProperties(['name' => $request->first_name . ' ' . $request->last_name])
            ->log('New job application submitted for: ' . $job->title);

        return response()->json([
            'message' => 'Application submitted successfully!',
            'application' => $application
        ], 210);
    }

    // Admin: Update application status (shortlisted, rejected, etc.)
    public function updateStatus(Request $request, $id)
    {
        $application = JobApplication::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:new,reviewing,shortlisted,interviewed,offered,rejected,withdrawn',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::guard('api')->user();

        $oldStatus = $application->status;
        $application->update([
            'status' => $request->status,
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        // Audit Log
        activity()
            ->performedOn($application)
            ->causedBy($user)
            ->withProperties(['old_status' => $oldStatus, 'new_status' => $request->status])
            ->log('Updated application status for: ' . $application->first_name . ' ' . $application->last_name);

        return response()->json([
            'message' => 'Application status updated successfully!',
            'application' => $application
        ]);
    }

    // Admin: Update internal notes on application
    public function updateNotes(Request $request, $id)
    {
        $application = JobApplication::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'notes' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::guard('api')->user();

        $application->update([
            'notes' => $request->notes,
        ]);

        // Audit Log
        activity()
            ->performedOn($application)
            ->causedBy($user)
            ->log('Updated internal notes on application for: ' . $application->first_name . ' ' . $application->last_name);

        return response()->json([
            'message' => 'Application notes updated successfully!',
            'application' => $application
        ]);
    }
}
